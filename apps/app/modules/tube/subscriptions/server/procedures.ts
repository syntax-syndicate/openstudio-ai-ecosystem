import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { subscriptions } from '@repo/backend/schema';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;

      if (userId === input.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot subscribe to yourself',
        });
      }

      const [createdSubscription] = await database
        .insert(subscriptions)
        .values({
          viewerId: userId!,
          creatorId: input.userId,
        })
        .returning();

      return createdSubscription;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { userId } = ctx;

      if (userId === input.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot unsubscribe from yourself',
        });
      }

      const [deletedSubscription] = await database
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, userId!),
            eq(subscriptions.creatorId, input.userId)
          )
        )
        .returning();

      return deletedSubscription;
    }),
});
