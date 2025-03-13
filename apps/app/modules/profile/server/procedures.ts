import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { Profile } from '@repo/backend/schema';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const profileRouter = createTRPCRouter({
  getOne: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const [profile] = await database
      .select()
      .from(Profile)
      .where(eq(Profile.id, userId!));

    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return profile;
  }),
  //TODO: Work in progress, placeholder for now
  /**
   * Saves the user's rules prompt and updates the rules accordingly.
   * Flow:
   * 1. Compare new prompt with old prompt (if exists)
   * 2. If prompts differ:
   *    a. For existing prompt: Identify added, edited, and removed rules
   *    b. For new prompt: Process all rules as additions
   * 3. Remove rules marked for deletion
   * 4. Edit existing rules that have changes
   * 5. Add new rules
   * 6. Update user's rules prompt in the database
   * 7. Return counts of created, edited, and removed rules
   */
  update: protectedProcedure
    .input(
      z.object({
        rulesPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { rulesPrompt } = input;

      // get old rulesPrompt
      const [oldRulesPrompt] = await database
        .select()
        .from(Profile)
        .where(eq(Profile.id, userId!));

      if (!oldRulesPrompt) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (oldRulesPrompt.rulesPrompt === rulesPrompt) {
        return { createdRules: 0, editedRules: 0, removedRules: 0 };
      }

      await database
        .update(Profile)
        .set({
          rulesPrompt,
        })
        .where(eq(Profile.id, userId!));
    }),
});
