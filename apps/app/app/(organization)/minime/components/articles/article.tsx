import { AnalyticsBadge } from '@/app/(organization)/minime/analytics/analytics-badge';
import { formatDate } from '@/helper/utils';
import type { Article as ArticleType } from '@/helper/utils';
import { Badge } from '@repo/design-system/components/ui/badge';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
interface Props {
  admin?: boolean;
  article: Pick<
    ArticleType,
    | 'id'
    | 'slug'
    | 'title'
    | 'createdAt'
    | 'views'
    | 'published'
    | 'publishedAt'
  >;
}

export default async function Article({ article, admin }: Props) {
  const isPublished = article.published;
  return (
    <div className="-mx-2 group relative flex min-h-5 items-center justify-between rounded-md p-2 text-sm transition-colors hover:bg-gray-3 max-md:h-auto max-md:flex-col max-md:items-start">
      <Link
        href={`/minime/articles/${admin ? article.id : article.slug}`}
        aria-label={`${article.title}`}
        className="absolute top-0 left-0 h-full w-full"
      />

      <div className="flex flex-1 items-center gap-2 max-md:flex-col max-md:items-baseline max-md:gap-1">
        <span className="block w-24 text-gray-4 transition-colors group-hover:text-secondary">
          {formatDate(article.publishedAt)}
        </span>
        <h5>
          <Balancer>{article.title}</Balancer>
        </h5>
      </div>
      {admin && (
        <div className="flex justify-end max-md:mt-2 max-md:w-full ">
          <div className="z-10 flex items-center gap-1">
            <Link
              href={`/minime/articles?published=${isPublished ? 'true' : 'false'}`}
            >
              <Badge className="h-4 px-1 py-2 font-normal hover:bg-gray-2">
                {isPublished ? 'Public' : 'Draft'}
              </Badge>
            </Link>
            <AnalyticsBadge
              href={`/minime/articles/${article.id}/analytics`}
              value={article.views!}
              published={article.published!}
              index="views"
            />
          </div>
        </div>
      )}
    </div>
  );
}
