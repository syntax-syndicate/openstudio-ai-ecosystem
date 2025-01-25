import { getBookmarksByAuthor } from '@/actions/bookmarks';
import { getCollectionsByAuthor } from '@/actions/collections';
import Bookmark from '@/app/(organization)/minime/components/bookmarks/bookmark';
import CollectionBar from '@/app/(organization)/minime/components/bookmarks/collections/collections-bar';
import NoBookmarksPlaceholder from '@/app/(organization)/minime/components/bookmarks/no-bookmarks-placeholder';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import { type Collection, sortBookmarks } from '@/helper/utils';
import { getUserByDomain } from '@repo/backend/auth/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Bookmarks',
};

interface BookmarksPageProps {
  params: {
    domain: string;
  };
  searchParams: {
    collection?: string;
  };
}

export default async function Bookmarks({
  params,
  searchParams: { collection },
}: BookmarksPageProps) {
  const { domain } = await params;
  const domain_decoded = decodeURIComponent(domain);
  const user = await getUserByDomain(domain_decoded);
  if (!user) {
    return notFound();
  }
  const [collections, bookmarks] = await Promise.all([
    getCollectionsByAuthor(user.id),
    getBookmarksByAuthor(user.id),
  ]);
  const sortedBookmarks = sortBookmarks(bookmarks, collection);
  return (
    <AppShell>
      <AppHeader title="Bookmarks" />
      <CollectionBar collections={collections} currentCollection={collection} />
      <div className="flex w-full flex-col">
        {sortedBookmarks.map((bookmark) => (
          <Bookmark
            bookmark={bookmark}
            collection={bookmark?.collection as Collection}
            key={bookmark.id}
          />
        ))}
        {!sortedBookmarks.length && <NoBookmarksPlaceholder />}
      </div>
    </AppShell>
  );
}
