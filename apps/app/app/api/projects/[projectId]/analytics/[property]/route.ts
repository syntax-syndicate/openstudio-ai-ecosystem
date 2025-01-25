import { verifyProjectAccess } from "@/actions/projects";
import {
  ZodAnalyticsProperty,
  analyticsSearchParamsSchema,
  getAnalytics,
} from "@repo/tinybird/src/utils";
import { guard } from "@/lib/auth";
import { database } from "@repo/backend/database";
import { projects } from "@repo/backend/schema";
import { NextResponse } from "next/server";
import * as z from "zod";
import { and, eq } from "drizzle-orm";

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string().min(1),
    property: ZodAnalyticsProperty,
  }),
});

export const GET = guard(
  async ({
    user,
    ctx,
    searchParams: { interval },
  }) => {
    try {
      const { projectId, property } = await ctx.params;
      const project = await database.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.authorId, user.id)));

      if (!project) {
        return new Response("Project not found", {
          status: 404,
        });
      }

      if (!(await verifyProjectAccess(project[0].id, user.id))) {
        return new Response(null, { status: 403 });
      }

      const data = await getAnalytics({
        property,
        interval,
        page: `/user/kuluruvineeth/projects/${project[0].slug}`, //TODO: change to user slug like /projects/project-slug
        userId: user.id,
      });

      return NextResponse.json(data);
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    requiredPlan: "Pro",
    schemas: {
      contextSchema: routeContextSchema,
      searchParamsSchema: analyticsSearchParamsSchema,
    },
  },
);
