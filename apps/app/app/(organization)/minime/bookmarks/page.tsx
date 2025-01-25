import AddBookmarkOrCollection from "@/app/(organization)/minime/components/bookmarks/add-bookmark-or-collection";
import Bookmark from "@/app/(organization)/minime/components/bookmarks/bookmark";
import CollectionBar from "@/app/(organization)/minime/components/bookmarks/collections/collections-bar";
import Collections from "@/app/(organization)/minime/components/bookmarks/collections/collections-modal";
import NoBookmarksPlaceholder from "@/app/(organization)/minime/components/bookmarks/no-bookmarks-placeholder";
import AppShell from "@/app/(organization)/minime/components/layout/app-shell";
import AppHeader from "@/app/(organization)/minime/components/layout/app-header";
import { getBookmarks } from "@/actions/bookmarks";
import { getCollections } from "@/actions/collections";
import { BookmarkWithCollection, sortBookmarks } from "@/helper/utils";
import { Collection } from "@/helper/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

interface BookmarksPageProps {
  searchParams: {
    collection?: string;
  };
}

export default async function Bookmarks({
  searchParams,
}: BookmarksPageProps) {
  const { collection } = await searchParams;
  const [bookmarks, collections] = await Promise.all([
    getBookmarks(),
    getCollections(),
  ]);
  console.log(collections);
  const sortedBookmarks = sortBookmarks(bookmarks, collection);

  return (
    <AppShell>
      <AppHeader title="Bookmarks">
        <div className="flex items-center gap-1">
          <Collections collections={collections} />
          <AddBookmarkOrCollection collections={collections} />
        </div>
      </AppHeader>
      <CollectionBar collections={collections} currentCollection={collection} />
      <div>
        {sortedBookmarks.map((bookmark) => (
          <Bookmark
            bookmark={bookmark}
            collection={bookmark?.collection as Collection}
            collections={collections}
            key={bookmark.id}
            admin
          />
        ))}
        {!sortedBookmarks.length && <NoBookmarksPlaceholder description />}
      </div>
    </AppShell>
  );
}
