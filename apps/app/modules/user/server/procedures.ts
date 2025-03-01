import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { getUserById } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { premium } from '@repo/backend/schema';
import { getCountPerUser } from '@repo/tinybird/src/query';
import { and, eq } from 'drizzle-orm';

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await getUserById(userId!);

    return user;
  }),
  getPremium: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const user = await getUserById(userId!);

    if (!user) throw new Error('Unauthorized');

    const premiumData = await database
      .select()
      .from(premium)
      .where(
        and(
          eq(premium.userId, user.id),
          eq(premium.organizationId, user.user_metadata.organization_id)
        )
      );

    const messagesCountPerMonth = await getCountPerUser({
      userEmail: user.email!,
    });

    return {
      premium: premiumData[0],
      user,
      messagesCountPerMonth: messagesCountPerMonth.data[0].count ?? 0,
    };
  }),
});
