import { generateObject, openai } from '@repo/ai';
import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';
import { schemaTask } from '@trigger.dev/sdk/v3';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

//TODO: Testing by combining both tasks into one, if works, remove the other tasks

import { YOUTUBE_CHAPTERS_PROMPT } from './generate-chapters';
import { YOUTUBE_DESCRIPTION_PROMPT } from './generate-description';

export const generateVideoMetadata = schemaTask({
  id: 'generate-video-metadata',
  schema: z.object({
    videoId: z.string(),
    userId: z.string(),
    organizationId: z.string(),
  }),
  run: async ({ videoId, userId, organizationId }) => {
    console.log('Generating metadata for video', videoId);

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

    // Step 3: Generate chapters first
    const chaptersResult = await generateObject({
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

    if (
      !chaptersResult.object.chapters ||
      chaptersResult.object.chapters.length === 0
    ) {
      throw new Error('Chapters not found');
    }

    const chapters = chaptersResult.object.chapters;

    // Step 4: Generate description with chapters included
    const descriptionResult = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        description: z.string().describe('The description of the video'),
      }),
      messages: [
        { role: 'system', content: YOUTUBE_DESCRIPTION_PROMPT },
        {
          role: 'user',
          content: `
Transcript: ${text}

Video Chapters:
${chapters.map((chapter) => `${chapter.start} - ${chapter.title}`).join('\n')}
          `,
        },
      ],
    });

    if (!descriptionResult.object.description) {
      throw new Error('Description not found');
    }

    // Step 5: Update the video with both chapters and description
    await database
      .update(videos)
      .set({
        chapters: chapters,
        description: descriptionResult.object.description,
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
