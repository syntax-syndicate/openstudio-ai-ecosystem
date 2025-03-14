import { Readable } from 'stream';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { organization, videos } from '@repo/backend/schema';
import { syncYoutubeComments } from '@repo/jobs/tasks/comments/youtube-comments-sync';
import {
  getCommentsWithReplies,
  getLastSyncMetadata,
  getLatestAndOldestComment,
  getYoutubeCommentCounts,
  getYoutubeCommentReplies,
  getYoutubeCommentThreads,
} from '@repo/tinybird/src/query';
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

        return response.data;
      } catch (error) {
        console.error('YouTube upload error:', error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to upload video to YouTube: ${error}`,
        });
      }
    }),
  getCommentsWithReplies: protectedProcedure
    .input(
      z.object({
        organization_id: z.string().uuid(),
        video_id: z.string().uuid().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const comments = await getCommentsWithReplies({
        organization_id: input.organization_id,
        video_id: input.video_id,
        limit: input.limit,
        offset: input.offset,
      });

      if (!comments) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comments not found',
        });
      }

      return comments.data;
    }),
  getCommentThreads: protectedProcedure
    .input(
      z.object({
        organization_id: z.string(),
        video_id: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const commentThreads = await getYoutubeCommentThreads({
        organization_id: input.organization_id,
        video_id: input.video_id,
        limit: input.limit,
        offset: input.offset,
      });

      if (!commentThreads) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comments not found',
        });
      }

      return commentThreads.data;
    }),
  getCommentReplies: protectedProcedure
    .input(
      z.object({
        organization_id: z.string(),
        parent_id: z.string(),
        video_id: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const commentReplies = await getYoutubeCommentReplies({
        organization_id: input.organization_id,
        parent_id: input.parent_id,
        video_id: input.video_id,
        limit: input.limit,
        offset: input.offset,
      });

      if (!commentReplies) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment replies not found',
        });
      }

      return commentReplies.data;
    }),
  syncComments: protectedProcedure
    .input(
      z.object({
        organization_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const job = await syncYoutubeComments.trigger({
        organizationId: input.organization_id,
        syncFrequency: 'manual',
      });

      return {
        jobId: job.id,
        publicAccessToken: job.publicAccessToken,
      };
    }),
  getSyncMetadata: protectedProcedure
    .input(
      z.object({
        organization_id: z.string(),
        channel_id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      // Use Promise.all for parallel execution of independent queries
      const [lastSyncData, latestAndOldestCommentData, commentCountsData] =
        await Promise.all([
          getLastSyncMetadata({
            organization_id: input.organization_id,
            channel_id: input.channel_id,
          }),
          getLatestAndOldestComment({
            organization_id: input.organization_id,
          }),
          getYoutubeCommentCounts({
            organization_id: input.organization_id,
          }),
        ]);

      // Check if we have valid data from all queries
      if (!commentCountsData || !lastSyncData || !latestAndOldestCommentData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Sync metadata not found',
        });
      }

      // Return the data
      return {
        ...lastSyncData?.data?.[0],
        ...latestAndOldestCommentData?.data?.[0],
        ...commentCountsData.data?.[0],
      };
    }),
  //TODO: ADDED FOR TESTING AND REMOVE AFTER TESTING
  getComments: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const youtubeClient = await getYouTubeClient(
      ctx.user.user_metadata.organization_id
    );

    const organizationData = await database
      .select()
      .from(organization)
      .where(eq(organization.id, ctx.user.user_metadata.organization_id));

    if (!organizationData || !organizationData[0].youtubeChannelId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      });
    }

    const comments = await youtubeClient.commentThreads.list({
      part: ['snippet', 'replies'],
      allThreadsRelatedToChannelId: organizationData[0].youtubeChannelId,
      maxResults: 100,
    });

    return comments.data;
  }),
  getVideos: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const youtubeClient = await getYouTubeClient(
      ctx.user.user_metadata.organization_id
    );

    const res = await youtubeClient.videos.list({
      part: [
        'snippet',
        'contentDetails',
        'status',
        'statistics',
        'topicDetails',
        'localizations',
        'player',
        'recordingDetails',
        'fileDetails',
        'id',
        'liveStreamingDetails',
        'paidProductPlacementDetails',
        'suggestions',
        'processingDetails',
      ],
      id: ['2AQRBQC4s0Y'], //TODO: Make this dynamic later, anyways this is still not implemented
    });

    return res.data;
  }),
});
