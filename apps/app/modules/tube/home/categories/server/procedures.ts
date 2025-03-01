import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { database } from '@repo/backend/database';
import { categories } from '@repo/backend/schema';

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await database.select().from(categories);
    return data;
  }),
});
