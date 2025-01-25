import type { Project as ProjectType } from '@/helper/utils';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Icons } from '@repo/design-system/components/ui/icons';
import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { AnalyticsBadge } from '../analytics/analytics-badge';
interface Props {
  admin?: boolean;
  project: Pick<
    ProjectType,
    'id' | 'title' | 'year' | 'description' | 'slug' | 'views' | 'published'
  > & {
    isProtected: boolean;
  };
  url: string;
}

export default function Project({ project, admin, url }: Props) {
  const isPublished = project.published;
  return (
    <div className="-mx-2 group relative flex min-h-5 items-center justify-between rounded-md p-2 text-sm transition-colors hover:bg-gray-3 max-md:h-auto max-md:flex-col max-md:items-start">
      <Link
        href={`${url}/${admin ? project.id : project.slug}`}
        className="absolute top-0 left-0 h-full w-full py-2"
        aria-label={`${project.title}`}
      />
      <div className="flex flex-1 items-start gap-1 max-md:flex-col">
        <span className="w-10 truncate text-left text-gray-4 transition-colors group-hover:text-secondary">
          {project.year}
        </span>
        <div className="flex w-full flex-1 flex-col">
          <h5>
            <Balancer>{project.title}</Balancer>
          </h5>
          <p className="text-gray-4 text-xs">{project?.description}</p>
        </div>
      </div>

      <div className="z-10 flex items-center justify-end max-md:mt-2 max-md:w-full">
        <div className="flex items-center gap-1">
          {project.isProtected && (
            <Badge className="flex h-4 cursor-default items-center gap-1 px-1 py-2 font-normal hover:bg-gray-2">
              <Icons.locked size={14} /> Locked
            </Badge>
          )}
          {admin && (
            <>
              <Link href={`${url}?published=${isPublished ? 'true' : 'false'}`}>
                <Badge className="h-4 px-1 py-2 font-normal hover:bg-gray-2">
                  {isPublished ? 'Public' : 'Draft'}
                </Badge>
              </Link>

              <AnalyticsBadge
                href={`${url}/${project.id}/analytics`}
                value={project.views ?? 0}
                published={project.published ?? false}
                index="views"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
