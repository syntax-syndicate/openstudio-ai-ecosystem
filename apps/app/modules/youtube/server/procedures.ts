import { Readable } from 'stream';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';
import { getYouTubeClient } from '@repo/youtube';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const youtubeRouter = createTRPCRouter({
  upload: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;

      //step1: get video details
      const [video] = await database
        .select()
        .from(videos)
        .where(eq(videos.id, input.videoId));

      if (!video) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Video not found' });
      }

      const muxPlaybackId = video.muxPlaybackId;
      const videoUrl = `https://stream.mux.com/${muxPlaybackId}/highest.mp4`;

      //step2: upload video to youtube
      const youtubeClient = await getYouTubeClient(video.organizationId);

      const videoResponse = await fetch(videoUrl);
      console.log('videoResponse', videoResponse);
      if (!videoResponse.ok) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch video from Mux',
        });
      }
      // Convert ReadableStream to Node.js Readable
      if (!videoResponse.body) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get video stream from Mux: Response body is null',
        });
      }
      //TODO: fix this typo
      const readableStream = Readable.from(videoResponse.body as any);

      try {
        const response = await youtubeClient.videos.insert({
          part: ['snippet', 'status'],
          requestBody: {
            snippet: {
              title: video.title,
              description: video.description,
              thumbnails: {
                default: {
                  url: video.thumbnailUrl, //TODO: Working, but not showing in the UI of Youtube
                },
              },
            },
            status: {
              privacyStatus: video.visibility,
            },
          },
          media: {
            mimeType: 'video/mp4',
            body: readableStream,
          },
        });

        console.log('response', response);
        return response.data;
      } catch (error) {
        console.error('YouTube upload error:', error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to upload video to YouTube: ${error}`,
        });
      }
    }),
});
