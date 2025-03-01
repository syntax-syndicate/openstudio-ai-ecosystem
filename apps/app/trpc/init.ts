import { getSession } from '@repo/backend/auth/session';
import { currentUser } from '@repo/backend/auth/utils';
import { rateLimit } from '@repo/rate-limit';
import { TRPCError, initTRPC } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  const {
    data: { session },
  } = await getSession();

  return {
    userId: session?.user?.id,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;
    if (!ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const user = await currentUser();

    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { success } = await rateLimit.trpc.limit(user.id);
    if (!success) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
    }

    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  }
);
