import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query((opts) => {
      return `Hello ${opts.input.name}`;
    }),
});

export type AppRouter = typeof appRouter;
