import Bookmark from "@/app/(organization)/minime/components/bookmarks/bookmark";
import CollectionBar from "@/app/(organization)/minime/components/bookmarks/collections/collections-bar";
import NoBookmarksPlaceholder from "@/app/(organization)/minime/components/bookmarks/no-bookmarks-placeholder";
import AppShell from "@/app/(organization)/minime/components/layout/app-shell";
import AppHeader from "@/app/(organization)/minime/components/layout/app-header";
import { getBookmarksByAuthor } from "@/actions/bookmarks";
import { getCollectionsByAuthor } from "@/actions/collections";
import { getUserByDomain } from "@repo/backend/auth/utils";
import { Collection, sortBookmarks } from "@/helper/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Bookmarks",
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
      <div className="w-full flex flex-col">
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
