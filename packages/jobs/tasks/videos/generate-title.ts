import { generateObject, openai } from '@repo/ai';
import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const YOUTUBE_TITLE_PROMPT = `
Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Follow these guidelines to create a title that maximizes discoverability, hooks viewers, and reflects the content accurately:

- Analyze the transcript to pinpoint the main topic and any unique or compelling elements, such as specific tools, techniques, trending ideas, or standout features.
- Include 1-3 high-impact keywords that match likely search terms. Position them early in the title to boost SEO performance.
- Use the pipe symbol (|) to separate key phrases or keywords, improving readability and search weighting (e.g., "Fix Bugs | Python Tricks").
- Emphasize the video’s most attention-grabbing aspect—like a quick solution, a hot trend, or a beginner-friendly angle—to spark viewer interest.
- Incorporate action verbs (e.g., "Master," "Create," "Solve") or value-driven terms (e.g., "Easy," "Pro Tips") to make the title dynamic and appealing.
- Optionally, add 1-2 relevant emojis if they align with the content and resonate with the target audience (e.g., 🎨 for art, ⚙️ for tech). Avoid overuse.
- Keep language simple and avoid niche jargon unless it’s a searchable term for the intended viewers (e.g., "Kubernetes" for tech pros).
- Ensure the title is 3-8 words long and under 100 characters (including spaces, |, and emojis) to fit YouTube’s display limits.
- Confirm the title truthfully represents the video content to build trust and avoid misleading viewers.
- Craft a creative, catchy phrase while adhering to all specified rules.

Return ONLY the title as plain text. No quotes, brackets, or extra formatting.
`;

export const generateYoutubeTitle: any = schemaTask({
  id: 'generate-youtube-title',
  schema: z.object({
    videoId: z.string(),
    userId: z.string(),
    organizationId: z.string(),
  }),
  run: async ({ videoId, userId, organizationId }) => {
    console.log('Generating title for video', videoId);

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

    // Step 3: Generate the title
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        title: z.string().describe('The title of the video'),
      }),
      messages: [
        {
          role: 'system',
          content: YOUTUBE_TITLE_PROMPT,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    if (!result.object.title) {
      throw new Error('Title not found');
    }

    // Step 4: Update the video with the new title
    await database
      .update(videos)
      .set({
        title: result.object.title || video.title,
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
