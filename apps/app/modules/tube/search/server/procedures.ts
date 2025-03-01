import { and, desc, eq, getTableColumns, ilike, lt, or } from 'drizzle-orm';
import { z } from 'zod';

import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { database as db } from '@repo/backend/database';
import {
  Users,
  videoReactions,
  videoViews,
  videos,
} from '@repo/backend/schema';

export const searchRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        query: z.string().nullish(),
        categoryId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit, query, categoryId } = input;

      console.log('query', query);
      console.log('categoryId', categoryId);
      console.log('cursor', cursor);
      console.log('limit', limit);

      const data = await db
        .select({
          ...getTableColumns(videos),
          user: Users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, 'like')
            )
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, 'dislike')
            )
          ),
        })
        .from(videos)
        .innerJoin(Users, eq(videos.userId, Users.id))
        .where(
          and(
            ilike(videos.title, `%${query}%`),
            categoryId ? eq(videos.categoryId, categoryId) : undefined,
            cursor
              ? or(
                  lt(videos.updatedAt, cursor.updatedAt),
                  and(
                    eq(videos.updatedAt, cursor.updatedAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videos.updatedAt), desc(videos.id))
        // Add 1 to the limit to check if there is more data
        .limit(limit + 1);

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
        items,
        nextCursor,
      };
    }),
});
