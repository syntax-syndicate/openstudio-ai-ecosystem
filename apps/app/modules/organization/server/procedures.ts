import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { organization } from '@repo/backend/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const organizationRouter = createTRPCRouter({
  updateYoutubeCommentSyncFrequency: protectedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        frequency: z.enum([
          'manual',
          'hourly',
          '6hours',
          '12hours',
          'daily',
          'weekly',
          'monthly',
          'quaterly',
          'half_yearly',
          'yearly',
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { organizationId, frequency } = input;

      const updatedOrganization = await database
        .update(organization)
        .set({
          youtubeCommentDataSyncFrequency: frequency,
          updatedAt: new Date(),
        })
        .where(eq(organization.id, organizationId))
        .returning();

      if (!updatedOrganization) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update organization',
        });
      }

      return { success: true };
    }),
});
