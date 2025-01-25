import { deleteProject, updateProject } from '@/actions/projects';
import { guard } from '@/lib/auth';
import { projectPatchSchema } from '@/lib/validations/project';
import * as z from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
  }),
});

export const PATCH = guard(
  async ({ user, body, ctx }) => {
    try {
      const { projectId } = await ctx.params;

      await updateProject(projectId, user.id, body);

      return new Response(null, { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      contextSchema: routeContextSchema,
      bodySchema: projectPatchSchema,
    },
  }
);

export const DELETE = guard(
  async ({ user, ctx }) => {
    try {
      const { projectId } = await ctx.params;

      await deleteProject(projectId, user.id);

      return new Response(null, { status: 204 });
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      contextSchema: routeContextSchema,
    },
  }
);
