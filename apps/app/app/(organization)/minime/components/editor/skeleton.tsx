import { Skeleton } from '@repo/design-system/components/ui/skeleton';

export default function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-4.5 w-4.5" />
          <Skeleton className="h-4.5 w-4.5" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-[18px] w-[18px]" />
          <Skeleton className="h-[18px] w-[40px]" />
          <Skeleton className="h-4.5 w-[90px]" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4.5 w-1/2" />
        {[...new Array(10).fill(true)].map((_, i) => (
          <Skeleton className="h-4.5" key={i} />
        ))}
      </div>
    </div>
  );
}
