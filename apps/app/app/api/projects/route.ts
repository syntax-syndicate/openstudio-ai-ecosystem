import { createProject } from '@/actions/projects';
import { guard } from '@/lib/auth';
import { projectCreateSchema } from '@/lib/validations/project';
import { database } from '@repo/backend/database';
import { projects } from '@repo/backend/schema';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export const POST = guard(
  async ({ user, plan, body }) => {
    try {
      const projectsCount = await database
        .select({ count: sql`count(*)` })
        .from(projects)
        .where(eq(projects.authorId, user.id))
        .then((result) => Number(result[0].count));

      //TODO: focus on adding this later

      //   if (
      //     typeof plan.maxPostLimit === "number" &&
      //     projectsCount >= plan.maxPostLimit &&
      //     !plan.isPro
      //   ) {
      //     return new Response(
      //       `If you want to share more than ${plan.maxPostLimit} article(s), upgrade the plan to Pro`,
      //       { status: 403 },
      //     );
      //   }
      const project = await createProject(user.id, body);

      return new Response(JSON.stringify({ id: project[0].id }), {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      bodySchema: projectCreateSchema,
    },
  }
);
