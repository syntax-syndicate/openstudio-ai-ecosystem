'use server';
import { formatVerboseDate } from '@/helper/utils';
import type { bookmarkSchema } from '@/lib/validations/bookmark';
import type { ExportResponse } from '@/types/minime';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { bookmarks, collections } from '@repo/backend/schema';
import { and, desc, eq } from 'drizzle-orm';
import { json2csv } from 'json-2-csv';
import type { z } from 'zod';

type BookmarkSchema = z.infer<typeof bookmarkSchema>;

export async function getBookmarksByAuthor(author: string, limit?: number) {
  return await database
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      clicks: bookmarks.clicks,
      createdAt: bookmarks.createdAt,
      updatedAt: bookmarks.updatedAt,
      authorId: bookmarks.authorId,
      organizationId: bookmarks.organizationId,
      collectionId: bookmarks.collectionId,
      collection: collections,
    })
    .from(bookmarks)
    .leftJoin(collections, eq(bookmarks.collectionId, collections.id))
    .where(eq(bookmarks.authorId, author))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit || 50);
}

export async function getBookmarks(limit?: number) {
  const user = await currentUser();
  return await database
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      clicks: bookmarks.clicks,
      createdAt: bookmarks.createdAt,
      updatedAt: bookmarks.updatedAt,
      authorId: bookmarks.authorId,
      organizationId: bookmarks.organizationId,
      collectionId: bookmarks.collectionId,
      collection: collections,
    })
    .from(bookmarks)
    .leftJoin(collections, eq(bookmarks.collectionId, collections.id))
    .where(eq(bookmarks.authorId, user!.id))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit || 50);
}

export async function getBookmarksByCollection(collectionName: string) {
  const user = await currentUser();

  return await database
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      clicks: bookmarks.clicks,
      collection: collections,
    })
    .from(bookmarks)
    .leftJoin(collections, eq(bookmarks.collectionId, collections.id))
    .where(
      and(
        eq(bookmarks.authorId, user!.id),
        collectionName !== 'all'
          ? eq(collections.name, collectionName)
          : undefined
      )
    );
}

export async function getBookmarkById(bookmarkId: string) {
  const user = await currentUser();
  return await database
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.authorId, user!.id)))
    .limit(1)
    .then((res) => res[0] || null);
}

export async function getBookmarksExport(
  authorId: string
): Promise<ExportResponse> {
  const bookmarksData = await database
    .select({
      title: bookmarks.title,
      url: bookmarks.url,
      clicks: bookmarks.clicks,
      createdAt: bookmarks.createdAt,
      updatedAt: bookmarks.updatedAt,
      collection: {
        name: collections.name,
      },
    })
    .from(bookmarks)
    .leftJoin(collections, eq(bookmarks.collectionId, collections.id))
    .where(eq(bookmarks.authorId, authorId));

  const filename = `openstudio_minime_bookmarks_export.csv`;

  const content = json2csv(
    bookmarksData.map(({ collection, createdAt, updatedAt, ...bookmark }) => {
      return {
        ...bookmark,
        createdAt: formatVerboseDate(createdAt),
        updatedAt: formatVerboseDate(updatedAt),
        collectionName: collection?.name ?? null,
      };
    })
  );

  return { filename, content };
}

//create bookmark
export async function createBookmark(authorId: string, body: BookmarkSchema) {
  const user = await currentUser();
  return await database.insert(bookmarks).values({
    title: body.title,
    url: body.url,
    authorId,
    organizationId: user!.user_metadata.organization_id,
    collectionId: body.collection,
  });
}

//update bookmark
export async function updateBookmark(
  bookmarkId: string,
  authorId: string,
  body: BookmarkSchema
) {
  return await database
    .update(bookmarks)
    .set({
      title: body.title,
      url: body.url,
      collectionId: body.collection,
    })
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.authorId, authorId)));
}

// delete bookmark
export async function deleteBookmark(bookmarkId: string, authorId: string) {
  const bookmark = await database
    .delete(bookmarks)
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.authorId, authorId)))
    .returning();
  return bookmark[0].id;
}

//verify bookmark access
export async function verifyBookmarkAccess(
  bookmarkId: string,
  authorId: string
) {
  const bookmark = await database
    .select({ count: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.id, bookmarkId), eq(bookmarks.authorId, authorId)));
  return bookmark.length > 0;
}
