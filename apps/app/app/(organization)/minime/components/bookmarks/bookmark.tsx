import type { Bookmark as BookmarkType, Collection } from '@/helper/utils';
import { Badge } from '@repo/design-system/components/minime/badge';
import { getDomainFromURL } from '@repo/design-system/lib/utils';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { AnalyticsBadge } from '../analytics/analytics-badge';
import Favicon from './bookmark-favicon';
import BookmarkOperations from './bookmark-operations';

interface Props {
  admin?: boolean;
  bookmark: Pick<BookmarkType, 'id' | 'title' | 'url' | 'clicks'>;
  collection?: Pick<Collection, 'id' | 'name'>;
  collections?: Collection[];
}

export default function Bookmark({
  bookmark,
  admin,
  collections,
  collection,
}: Props) {
  return (
    <div className="-mx-2 relative flex min-h-5 items-center gap-4 rounded-md p-2 text-sm transition-colors hover:bg-gray-3 max-md:h-auto max-md:flex-col max-md:items-start max-md:gap-1">
      <Link
        aria-label={`Visit ${bookmark?.title}`}
        href={`https://openstudio.co.in/${bookmark.id}`}
        className="absolute top-0 left-0 h-full w-full py-2"
        target="_blank"
        prefetch={false}
      />
      <Favicon url={bookmark.url} alt={`${bookmark.title} Favicon`} size={20} />
      <div className="flex w-full gap-2 max-md:mt-1 max-md:items-start max-md:gap-1">
        <div className="flex flex-1 items-center gap-2 max-md:flex-col max-md:items-start max-md:gap-0">
          <h5>
            <Balancer>{bookmark.title}</Balancer>
          </h5>
          <p className="text-gray-4 text-xs">
            {getDomainFromURL(bookmark.url)}
          </p>
        </div>
      </div>
      {(admin || collection?.name) && (
        <div className="z-10 flex items-center justify-end gap-1 max-md:mt-2 max-md:w-full">
          {collection?.name && (
            <Link href={`/minime/bookmarks?collection=${collection.name}`}>
              <Badge className=" flex h-4 gap-1 px-1 py-2 font-normal hover:bg-gray-2">
                {collection.name}
              </Badge>
            </Link>
          )}
          {admin && (
            <div className="flex items-center gap-6">
              <AnalyticsBadge
                href={`/minime/bookmarks/${bookmark.id}/analytics`}
                value={bookmark.clicks || 0}
                index="clicks"
                published
              />
              <BookmarkOperations
                bookmark={bookmark}
                collections={collections}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
