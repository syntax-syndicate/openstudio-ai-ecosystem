import { verifyBookmarkAccess } from "@/actions/bookmarks";
import {
  ZodAnalyticsProperty,
  analyticsSearchParamsSchema,
  getBookmarkAnalytics,
} from "@repo/tinybird/src/utils";
import { guard } from "@/lib/auth";
import { NextResponse } from "next/server";
import * as z from "zod";

const routeContextSchema = z.object({
  params: z.object({
    bookmarkId: z.string().min(1),
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
      const { bookmarkId, property } = await ctx.params;
      if (!(await verifyBookmarkAccess(bookmarkId, user.id))) {
        return new Response(null, { status: 403 });
      }

      const data = await getBookmarkAnalytics({
        id: bookmarkId,
        property,
        interval,
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
