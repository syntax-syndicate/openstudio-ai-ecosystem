import { verifyArticleAccess } from '@/actions/articles';
import { guard } from '@/lib/auth';
import { database } from '@repo/backend/database';
import { articles } from '@repo/backend/schema';
import {
  ZodAnalyticsProperty,
  analyticsSearchParamsSchema,
  getAnalytics,
} from '@repo/tinybird/src/utils';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    articleId: z.string().min(1),
    property: ZodAnalyticsProperty,
  }),
});

export const GET = guard(
  async ({ user, ctx, searchParams: { interval } }) => {
    try {
      const { articleId, property } = await ctx.params;
      const article = await database
        .select()
        .from(articles)
        .where(and(eq(articles.id, articleId), eq(articles.authorId, user.id)));

      if (!article) {
        return new Response('Article not found', {
          status: 404,
        });
      }
      if (!(await verifyArticleAccess(article[0].id, user.id))) {
        return new Response(null, { status: 403 });
      }

      const data = await getAnalytics({
        property,
        interval,
        page: `/user/kuluruvineeth/articles/${article[0].slug}`, //TODO: change to user slug like /articles/article-slug
        userId: user.id,
      });
      return NextResponse.json(data);
    } catch (err) {
      console.log('err', err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    requiredPlan: 'Pro',
    schemas: {
      contextSchema: routeContextSchema,
      searchParamsSchema: analyticsSearchParamsSchema,
    },
  }
);
