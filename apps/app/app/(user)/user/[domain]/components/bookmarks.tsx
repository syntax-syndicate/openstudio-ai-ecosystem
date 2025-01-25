import Bookmark from "@/app/(organization)/minime/components/bookmarks/bookmark";
import { Icons } from "@repo/design-system/components/ui/icons";
import Link from "next/link";
import { BookmarkWithCollection, Collection } from "@/helper/utils";

export default function Bookmarks({ bookmarks }: { bookmarks: BookmarkWithCollection[] }) {
  if (!bookmarks.length) {
    return null;
  }
  return (
    <dl className="section-container">
      <dt className="section-title link group">
        <Link
          href="/bookmarks"
          className="absolute w-full h-full "
          aria-label="View All Bookmarks"
        />
        <h3>Bookmarks</h3>
        <Icons.arrowRight
          size={16}
          className="text-gray-4 group-hover:text-secondary"
        />
      </dt>
      <dd className="section-content">
        {bookmarks.map((bookmark) => (
          <Bookmark
            bookmark={bookmark}
            collection={bookmark?.collection as Collection}
            key={bookmark.id}
          />
        ))}
      </dd>
    </dl>
  );
}
