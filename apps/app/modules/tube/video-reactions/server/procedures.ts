import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { videoReactions } from '@repo/backend/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const userId = ctx.user.id;

      const [existingVideoReactionLike] = await database
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, 'like')
          )
        );

      if (existingVideoReactionLike) {
        const [deletedViewerReaction] = await database
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [createdVideoReaction] = await database
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: 'like',
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: 'like',
          },
        })
        .returning();

      return createdVideoReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const userId = ctx.user.id;

      const [existingVideoReactionDislike] = await database
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.type, 'dislike')
          )
        );

      if (existingVideoReactionDislike) {
        const [deletedViewerReaction] = await database
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [createdVideoReaction] = await database
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: 'dislike',
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: 'dislike',
          },
        })
        .returning();

      return createdVideoReaction;
    }),
});
