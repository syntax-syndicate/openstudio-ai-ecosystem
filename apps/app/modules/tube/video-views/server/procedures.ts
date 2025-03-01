import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { videoViews } from '@repo/backend/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { user } = ctx;
      const { id: userId } = user;

      const [existingVideoView] = await database
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );
      if (existingVideoView) {
        return existingVideoView;
      }

      const [createdVideoView] = await database
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();

      return createdVideoView;
    }),
});
