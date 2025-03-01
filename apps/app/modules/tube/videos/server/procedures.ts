import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';
import { database } from '@repo/backend/database';
import {
  Users,
  videoReactions,
  videoUpdateSchema,
  videoViews,
  videos,
} from '@repo/backend/schema';
import { generateYoutubeChapters } from '@repo/jobs/tasks/videos/generate-chapters';
import { generateYoutubeDescription } from '@repo/jobs/tasks/videos/generate-description';
import { generateYoutubeTitle } from '@repo/jobs/tasks/videos/generate-title';
import { generateVideoMetadata } from '@repo/jobs/tasks/videos/generate-video-metadata';
import { mux } from '@repo/mux';
import { TRPCError } from '@trpc/server';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';

export const videosRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { userId } = ctx;

      const viewerReactions = database.$with('viewer_reactions').as(
        database
          .select({
            videoId: videoReactions.videoId,
            type: videoReactions.type,
          })
          .from(videoReactions)
          .where(inArray(videoReactions.userId, userId ? [userId] : []))
      );

      const [existingVideo] = await database
        .with(viewerReactions)
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(Users)
          },
          viewCount: database.$count(
            videoViews,
            eq(videoViews.videoId, videos.id)
          ),
          likeCount: database.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, 'like')
            )
          ),
          dislikeCount: database.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, 'dislike')
            )
          ),
          viewerReaction: viewerReactions.type,
        })
        .from(videos)
        .innerJoin(Users, eq(videos.userId, Users.id))
        .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
        .where(eq(videos.id, input.id));

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      // TODO: Remove this after testing
      // log.info('existingVideo', existingVideo);
      return existingVideo;
    }),
  generateChapters: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      await generateYoutubeChapters.trigger({
        videoId: id,
        userId: user.id,
        organizationId: user.user_metadata.organization_id,
      });
    }),
  generateVideoMetadata: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      await generateVideoMetadata.trigger({
        videoId: id,
        userId: user.id,
        organizationId: user.user_metadata.organization_id,
      });
    }),
  generateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      await generateYoutubeDescription.trigger({
        videoId: id,
        userId: user.id,
        organizationId: user.user_metadata.organization_id,
      });
    }),
  generateTitle: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      await generateYoutubeTitle.trigger({
        videoId: id,
        userId: user.id,
        organizationId: user.user_metadata.organization_id,
      });
    }),
  revalidate: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [existingVideo] = await database
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      if (!existingVideo) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!existingVideo.muxUploadId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const upload = await mux.video.uploads.retrieve(
        existingVideo.muxUploadId
      );

      if (!upload || !upload.asset_id) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const asset = await mux.video.assets.retrieve(upload.asset_id);

      if (!asset) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const playbackId = asset.playback_ids?.[0].id;
      const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;

      const [updatedVideo] = await database
        .update(videos)
        .set({
          muxStatus: asset.status,
          muxPlaybackId: playbackId,
          muxAssetId: asset.id,
          duration,
        })
        .where(eq(videos.id, input.id))
        .returning();

      return updatedVideo;
    }),
  restoreThumbnail: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      const [existingVideo] = await database
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.id, id),
            eq(videos.userId, user.id),
            eq(videos.organizationId, user.user_metadata.organization_id)
          )
        );

      if (!existingVideo)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video not found',
        });

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();
        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await database
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(
            and(
              eq(videos.id, id),
              eq(videos.userId, user.id),
              eq(videos.organizationId, user.user_metadata.organization_id)
            )
          );
      }

      if (!existingVideo.muxPlaybackId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Video is not ready to restore thumbnail',
        });
      }

      const utapi = new UTApi();

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const uploadedThumbnail =
        await utapi.uploadFilesFromUrl(tempThumbnailUrl);

      console.log(uploadedThumbnail);
      if (!uploadedThumbnail.data) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload thumbnail',
        });
      }

      const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;

      const [updatedVideo] = await database
        .update(videos)
        .set({ thumbnailKey, thumbnailUrl })
        .where(
          and(
            eq(videos.id, id),
            eq(videos.userId, user.id),
            eq(videos.organizationId, user.user_metadata.organization_id)
          )
        )
        .returning();

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      const [removedVideo] = await database
        .delete(videos)
        .where(
          and(
            eq(videos.id, id),
            eq(videos.userId, user.id),
            eq(videos.organizationId, user.user_metadata.organization_id)
          )
        )
        .returning();

      if (!removedVideo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video not found',
        });
      }

      return removedVideo;
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      if (!input.id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No video id provided',
        });
      }

      const [updatedVideo] = await database
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          visibility: input.visibility,
          categoryId: input.categoryId,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(videos.id, input.id),
            eq(videos.userId, user.id),
            eq(videos.organizationId, user.user_metadata.organization_id)
          )
        )
        .returning();

      if (!updatedVideo) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Video not found',
        });
      }

      return updatedVideo;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: user.id,
        //@ts-ignore
        static_renditions: [
          {
            resolution: 'highest',
          },
        ],
        playback_policy: ['public'],
        input: [
          {
            generated_subtitles: [
              {
                language_code: 'en',
                name: 'English',
              },
            ],
          },
        ],
      },
      cors_origin: '*', // TODO: change this to the application url in production
    });

    const [video] = await database
      .insert(videos)
      .values({
        userId: user.id,
        title: 'Untitled',
        organizationId: user.user_metadata.organization_id,
        muxStatus: 'waiting',
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video: video,
      url: upload.url,
    };
  }),
});
