import type { Collection } from '@/helper/utils';
import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';

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
          'w-max cursor-pointer rounded-md border border-gray-2 px-1 py-0.5 text-gray-4 text-xs',
          currentCollection ? '' : 'bg-gray-2 text-secondary'
        )}
      >
        All
      </Link>
      {collections.map((item) => (
        <Link
          href={`?collection=${item.name}`}
          className={cn(
            'w-max cursor-pointer rounded-md border border-gray-2 px-1 py-0.5 text-gray-4 text-xs',
            currentCollection === item.name ? 'bg-gray-2 text-secondary' : ''
          )}
          key={item.id}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
