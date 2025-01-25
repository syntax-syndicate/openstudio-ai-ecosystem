import { createBookmark } from "@/actions/bookmarks";
import { guard } from "@/lib/auth";
import { bookmarkSchema } from "@/lib/validations/bookmark";
import { database } from "@repo/backend/database";
import { bookmarks } from "@repo/backend/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

export const POST = guard(
  async ({ user, plan, body }) => {
    try {
      const bookmarksCount = await database.select({ count: sql`count(*)` }).from(bookmarks).where(eq(bookmarks.authorId, user.id)).then((result) => Number(result[0].count));

      //TODO: focus on adding this later
    //   if (
    //     typeof plan.maxPostLimit === "number" &&
    //     bookmarksCount >= plan.maxPostLimit &&
    //     !plan.isPro
    //   ) {
    //     return new Response(
    //       `If you want to share more than ${plan.maxPostLimit} bookmark(s), upgrade the plan to Pro`,
    //       { status: 403 },
    //     );
    //   }
      await createBookmark(user.id, body);

      return new Response(null, { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 500 });
    }
  },
  {
    schemas: {
      bodySchema: bookmarkSchema,
    },
  },
);
