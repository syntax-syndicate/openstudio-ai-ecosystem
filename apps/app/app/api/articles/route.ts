import { createArticle } from '@/actions/articles';
import { guard } from '@/lib/auth';
import { articleCreateSchema } from '@/lib/validations/article';
import { database } from '@repo/backend/database';
import { articles } from '@repo/backend/schema';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export const POST = guard(
  async ({ user, plan, body }) => {
    try {
      const articlesCount = await database
        .select({ count: sql`count(*)` })
        .from(articles)
        .where(eq(articles.authorId, user.id))
        .then((result) => Number(result[0].count));

      //TODO: focus on adding this later

      //   if (
      //     typeof plan.maxPostLimit === "number" &&
      //     articlesCount >= plan.maxPostLimit &&
      //     !plan.isPro
      //   ) {
      //     return new Response(
      //       `If you want to share more than ${plan.maxPostLimit} article(s), upgrade the plan to Pro`,
      //       { status: 403 },
      //     );
      //   }
      const article = await createArticle(user.id, body);

      return new Response(JSON.stringify({ id: article[0].id }), {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      bodySchema: articleCreateSchema,
    },
  }
);
