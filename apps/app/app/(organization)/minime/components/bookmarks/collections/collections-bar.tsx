import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";
import { Collection } from "@/helper/utils";

export default function CollectionBar({
  collections,
  currentCollection,
}: {
  collections: Collection[];
  currentCollection?: string;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Link
        href="/minime/bookmarks"
        className={cn(
          "rounded-md cursor-pointer  border w-max border-gray-2 py-0.5 px-1 text-xs text-gray-4",
          !currentCollection ? "bg-gray-2 text-secondary" : "",
        )}
      >
        All
      </Link>
      {collections.map((item) => (
        <Link
          href={`?collection=${item.name}`}
          className={cn(
            "rounded-md cursor-pointer  border w-max border-gray-2 py-0.5 px-1 text-xs text-gray-4",
            currentCollection === item.name ? "bg-gray-2 text-secondary" : "",
          )}
          key={item.id}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
