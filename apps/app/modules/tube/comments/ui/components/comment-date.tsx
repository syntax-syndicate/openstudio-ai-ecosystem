import { formatShortDate } from '@/lib/utils';
import { cn } from '@repo/design-system/lib/utils';

export function CommentDate(props: { date: Date; className?: string }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 font-medium text-gray-500 text-sm leading-5 dark:text-white',
        props.className
      )}
    >
      {formatShortDate(props.date, { includeYear: true, lowerCase: true })}
    </div>
  );
}
