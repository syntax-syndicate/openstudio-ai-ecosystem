import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';
import { database } from '@repo/backend/database';
import { Users, commentReactions, comments } from '@repo/backend/schema';
import { TRPCError } from '@trpc/server';
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from 'drizzle-orm';
import { z } from 'zod';

export const commentsRouter = createTRPCRouter({
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await database
        .delete(comments)
        .where(and(eq(comments.id, id), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return deletedComment;
    }),
  create: protectedProcedure
    .input(
      z.object({
        parentId: z.string().uuid().nullish(),
        videoId: z.string().uuid(),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId, value, parentId } = input;

      const [existingComment] = await database
        .select()
        .from(comments)
        .where(inArray(comments.id, parentId ? [parentId] : []));

      if (!existingComment && parentId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (existingComment?.parentId && parentId) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const [createdComment] = await database
        .insert(comments)
        .values({
          videoId,
          value,
          parentId,
          userId: ctx.user.id,
        })
        .returning();

      return createdComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const { videoId, cursor, limit, parentId } = input;

      const viewerReactions = database.$with('viewer_reactions').as(
        database
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(
            inArray(commentReactions.userId, ctx.userId ? [ctx.userId] : [])
          )
      );

      const replies = database.$with('replies').as(
        database
          .select({
            parentId: comments.parentId,
            count: count(comments.id).as('count'),
          })
          .from(comments)
          .where(isNotNull(comments.parentId))
          .groupBy(comments.parentId)
      );

      const [totalData, data] = await Promise.all([
        database
          .select({ count: count() })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId)
              // isNull(comments.parentId),
            )
          ),
        database
          .with(viewerReactions, replies)
          .select({
            ...getTableColumns(comments),
            user: Users,
            viewerReaction: viewerReactions.type,
            replyCount: replies.count,
            likeCount: database.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.type, 'like')
              )
            ),
            dislikeCount: database.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.type, 'dislike')
              )
            ),
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              parentId
                ? eq(comments.parentId, parentId)
                : isNull(comments.parentId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(Users, eq(comments.userId, Users.id))
          .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
          .leftJoin(replies, eq(replies.parentId, comments.id))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = data.length > limit;

      // Remove the last item if there is more data
      const items = hasMore ? data.slice(0, -1) : data;
      // Set the next cursor to the last item if there is more data
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        totalCount: totalData[0].count,
        items,
        nextCursor,
      };
    }),
});
