import { appConfig } from '@/config/links';
import { cn } from '@repo/design-system/lib/utils';
import Link from 'next/link';

export default function PostsFilter({
  segment,
  current,
}: {
  segment: string;
  current?: string;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {appConfig.filters.postsFilter.map((filter) => (
        <Link
          href={filter.href === '/' ? `/${segment}` : filter.href}
          className={cn(
            'w-max cursor-pointer rounded-md border border-gray-2 px-1 py-0.5 text-gray-4 text-xs',
            current === filter.value ? 'bg-gray-2 ' : ''
          )}
          key={filter.title}
        >
          {filter.title}
        </Link>
      ))}
    </div>
  );
}
