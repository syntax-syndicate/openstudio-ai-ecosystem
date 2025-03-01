import { generateObject, openai } from '@repo/ai';
import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const YOUTUBE_CHAPTERS_PROMPT = `
Your role is to segment the following transcript into meaningful chapters, summarizing each chapter with a concise title. 

### Instructions:

1. Analyze the transcript to identify natural topic transitions and key segments.
2. Create 5-15 chapters depending on video length and content complexity.
3. Each chapter should represent a distinct section or topic in the video.
4. Chapter titles should be:
   - Brief (3-6 words)
   - Descriptive of the content
   - Engaging to viewers
   - Consistent in style throughout

### Output Format:
- Return ONLY a list of chapters in YouTube chapter format
- Each line must start with a timestamp in HH:MM:SS format followed by a chapter title
- First chapter MUST start at 00:00:00
- Do not include any explanations, preamble, or additional text
- Example format:
  00:00:00 Introduction to Topic
  00:01:45 Key Concept Explained
  00:05:30 Practical Example

### Important:
- Timestamps must be in chronological order
- Estimate timestamps based on content transitions if exact times aren't provided
- Always include an introduction chapter at 00:00:00
- Do not include timestamps beyond the video's length
`;

export const generateYoutubeChapters: any = schemaTask({
  id: 'generate-youtube-chapters',
  schema: z.object({
    videoId: z.string(),
    userId: z.string(),
    organizationId: z.string(),
  }),
  run: async ({ videoId, userId, organizationId }) => {
    console.log('Generating chapters for video', videoId);

    // Step 1: Get the video
    const [video] = await database
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.id, videoId),
          eq(videos.userId, userId),
          eq(videos.organizationId, organizationId)
        )
      );
    if (!video) {
      throw new Error('Video not found');
    }

    // Step 2: Get the video's transcript
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();

    if (!text) {
      throw new Error('Transcript not found');
    }

    // Step 3: Generate the chapters
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        chapters: z
          .array(
            z.object({
              start: z.string().describe('The timestamp in HH:MM:SS format'),
              title: z.string().describe('The chapter title'),
            })
          )
          .describe('The chapters of the video'),
      }),
      messages: [
        { role: 'system', content: YOUTUBE_CHAPTERS_PROMPT },
        { role: 'user', content: text },
      ],
    });

    if (!result.object.chapters || result.object.chapters.length === 0) {
      throw new Error('Chapters not found');
    }

    // Step 4: Update the video with the new chapters
    await database
      .update(videos)
      .set({
        chapters: result.object.chapters,
      })
      .where(
        and(
          eq(videos.id, videoId),
          eq(videos.userId, userId),
          eq(videos.organizationId, organizationId)
        )
      );
  },
});
