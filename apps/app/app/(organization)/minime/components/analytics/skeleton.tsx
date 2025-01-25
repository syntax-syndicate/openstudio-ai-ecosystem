import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';

export default function AnalyticsSkeleton({ pages }: { pages?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4.5 w-[150px]" />
        <Skeleton className="h-4.5 w-[105px]" />
      </div>
      <Skeleton className="mt-2 h-[330px] w-full" />
      <div className="mt-2 grid grid-cols-2 gap-2 max-md:grid-cols-1">
        {[...new Array(pages ? 4 : 3).fill(true)].map((_, i) => (
          <Skeleton
            className={cn('h-[200px]', pages ? '' : 'last:col-span-2')}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}
