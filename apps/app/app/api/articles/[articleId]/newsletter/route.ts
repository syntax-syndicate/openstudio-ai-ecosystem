import { sendNewsletter } from '@/actions/articles';
import { getArticleByAuthor } from '@/actions/articles';
import { guard } from '@/lib/auth';
import * as z from 'zod';

const contextSchema = z.object({
  params: z.object({
    articleId: z.string().min(1),
  }),
});

export const POST = guard(
  async ({ user, ctx }) => {
    try {
      const { articleId } = await ctx.params;
      const article = await getArticleByAuthor(articleId, user.id);

      if (!article) {
        return new Response(null, { status: 404 });
      }

      if (!article[0].published) {
        return new Response(
          'You must publish this article to send newsletter',
          { status: 400 }
        );
      }

      if (!user.user_metadata.newsletter) {
        return new Response('Newsletter function is not active', {
          status: 400,
        });
      }

      return await sendNewsletter(article[0], user);
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    requiredPlan: 'Pro',
    schemas: {
      contextSchema,
    },
  }
);
