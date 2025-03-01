import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { commentReactions } from '@repo/backend/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;

      const [existingCommentReactionLike] = await database
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, ctx.user.id),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, 'like')
          )
        );

      if (existingCommentReactionLike) {
        const [deletedViewerReaction] = await database
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, ctx.user.id),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [createdCommentReaction] = await database
        .insert(commentReactions)
        .values({
          userId: ctx.user.id,
          commentId,
          type: 'like',
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: 'like',
          },
        })
        .returning();

      return createdCommentReaction;
    }),
  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;

      const [existingCommentReactionDislike] = await database
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, ctx.user.id),
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.type, 'dislike')
          )
        );

      if (existingCommentReactionDislike) {
        const [deletedViewerReaction] = await database
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, ctx.user.id),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedViewerReaction;
      }

      const [createdCommentReaction] = await database
        .insert(commentReactions)
        .values({
          userId: ctx.user.id,
          commentId,
          type: 'dislike',
        })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            type: 'dislike',
          },
        })
        .returning();

      return createdCommentReaction;
    }),
});
