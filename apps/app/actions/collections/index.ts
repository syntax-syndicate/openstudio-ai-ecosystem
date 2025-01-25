"use server";
import type * as z from "zod";
import { database } from "@repo/backend/database";
import { eq, and } from "drizzle-orm";
import { bookmarks, collections } from "@repo/backend/schema";
import type { collectionSchema } from "@/lib/validations/bookmark";
import { currentUser } from "@repo/backend/auth/utils";

type Schema = z.infer<typeof collectionSchema>;

export async function createCollection(authorId: string, data: Schema) {
  const user = await currentUser();
  const [newCollection] = await database.insert(collections)
    .values({
      ...data,
      authorId,
      organizationId: user!.user_metadata.organization_id,
    })
    .returning();
  
  return newCollection;
}

export async function updateCollection(
  collectionId: string,
  authorId: string,
  data: Schema,
) {
  const [updatedCollection] = await database
    .update(collections)
    .set(data)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.authorId, authorId)
      )
    )
    .returning();
  
  return updatedCollection;
}

export async function deleteCollection(collectionId: string, authorId: string) {
  const [deletedCollection] = await database
    .delete(collections)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.authorId, authorId)
      )
    )
    .returning();

  return deletedCollection.id;
}

export async function verifyCollectionAccess(
  collectionId: string,
  authorId: string,
) {
  const result = await database
    .select({ count: collections.id })
    .from(collections)
    .where(
      and(
        eq(collections.id, collectionId),
        eq(collections.authorId, authorId)
      )
    );

  return result.length > 0;
}


// get collections
// export async function getCollections() {
//   const user = await currentUser();
//   return await database
//     .select(
//         {
//             id: collections.id,
//             name: collections.name,
//             authorId: collections.authorId,
//             organizationId: collections.organizationId,
//             bookmarks: {
//                 id: bookmarks.id,
//                 title: bookmarks.title,
//                 url: bookmarks.url,
//                 collectionId: bookmarks.collectionId,
//                 authorId: bookmarks.authorId,
//                 organizationId: bookmarks.organizationId,
//                 createdAt: bookmarks.createdAt,
//                 updatedAt: bookmarks.updatedAt,
//                 clicks: bookmarks.clicks,
//             },
//         }
//     )
//     .from(collections)
//     .where(eq(collections.authorId, user!.id))
//     .leftJoin(bookmarks, eq(collections.id, bookmarks.collectionId));
// }
export async function getCollections() {
  const user = await currentUser();
  const results = await database
    .select({
      id: collections.id,
      name: collections.name,
      authorId: collections.authorId,
      organizationId: collections.organizationId,
    })
    .from(collections)
    .where(eq(collections.authorId, user!.id));

  // Get bookmarks for each collection
  const collectionsWithBookmarks = await Promise.all(
    results.map(async (collection) => {
      const bookmarksData = await database
        .select()
        .from(bookmarks)
        .where(eq(bookmarks.collectionId, collection.id));
      
      return {
        ...collection,
        bookmarks: bookmarksData.length ? bookmarksData : null
      };
    })
  );

  return collectionsWithBookmarks;
}

// get collections by author
export async function getCollectionsByAuthor(authorId: string, limit?: number) {
  return await database.select().from(collections).where(eq(collections.authorId, authorId)).limit(limit || 50);
}