import { eq, and, sql } from 'drizzle-orm';
import { database } from '@repo/backend/database';
import { bookmarks, projects, articles } from '@repo/backend/schema';

// export async function getUserViaEdge(
//   username?: string,
//   domain?: string,
//   userId?: string,
// ) {
//   const user = await db
//     .select()
//     .from(users)
//     .where(
//       and(
//         userId ? eq(users.id, userId) : undefined,
//         username ? eq(users.username, username) : undefined,
//         domain ? eq(users.domain, domain) : undefined,
//       )
//     )
//     .limit(1);

//   if (!user[0]) {
//     throw new Error("User not found");
//   }
//   const foundUser = user[0];
//   const id = foundUser.id;

//   if (!foundUser.lsId || !foundUser.lsCurrentPeriodEnd || !foundUser.lsVariantId) {
//     return {
//       userId: foundUser.id,
//       isPro: false,
//     };
//   }

//   squeezy();

//   const subscription = foundUser.lsId ? await getSubscription(foundUser.lsId) : null;

//   if (!subscription?.data) {
//     return {
//       userId: id,
//       isPro: false,
//     };
//   }

//   const {
//     data: {
//       data: {
//         attributes: { status },
//       },
//     },
//   } = subscription;

//   const isPro =
//     foundUser.lsId &&
//     foundUser.lsCurrentPeriodEnd &&
//     new Date(foundUser.lsCurrentPeriodEnd).getTime() + 86_400_000 > Date.now() &&
//     status !== "expired" &&
//     status !== "past_due" &&
//     status !== "unpaid" &&
//     status !== "paused";

//   return {
//     userId: id,
//     isPro,
//   };
// }

// export async function getUserAvatarViaEdge(username: string) {
//   const user = await db
//     .select({ image: users.image })
//     .from(users)
//     .where(eq(users.username, username))
//     .limit(1);

//   return user[0]?.image;
// }

export async function incrementBookmarkClicksViaEdge(
  bookmarkId: string,
  authorId: string,
) {
  return await database
    .update(bookmarks)
    .set({
      clicks: sql`${bookmarks.clicks} + 1`,
    })
    .where(
      and(
        eq(bookmarks.id, bookmarkId),
        eq(bookmarks.authorId, authorId)
      )
    )
    .returning();
}

export async function incrementProjectViewsViaEdge(
  slug: string,
  authorId: string,
) {
  return await database
    .update(projects)
    .set({
      views: sql`${projects.views} + 1`,
    })
    .where(
      and(
        eq(projects.slug, slug),
        eq(projects.authorId, authorId)
      )
    )
    .returning();
}

export async function incrementArticleViewsViaEdge(
  slug: string,
  authorId: string,
) {
  return await database
    .update(articles)
    .set({
      views: sql`${articles.views} + 1`,
    })
    .where(
      and(
        eq(articles.slug, slug),
        eq(articles.authorId, authorId)
      )
    )
    .returning();
}

export async function getBookmarkViaEdge(bookmarkId: string) {
  const bookmark = await database
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, bookmarkId))
    .limit(1);

  return bookmark[0];
}

export async function isArticleExist(slug: string, authorId: string) {
  const count = await database
    .select({ count: sql<number>`count(*)` })
    .from(articles)
    .where(
      and(
        eq(articles.authorId, authorId),
        eq(articles.slug, slug)
      )
    );

  return count[0].count > 0;
}

export async function isProjectExist(slug: string, authorId: string) {
  const count = await database
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(
      and(
        eq(projects.authorId, authorId),
        eq(projects.slug, slug)
      )
    );

  return count[0].count > 0;
}