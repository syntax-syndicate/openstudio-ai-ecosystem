import type { IndexProps } from '@/app/(organization)/minime/components/analytics';
import { Badge } from '@repo/design-system/components/minime/badge';
import { Icons } from '@repo/design-system/components/ui/icons';
import Link from 'next/link';

export function AnalyticsBadge({
  href,
  value,
  index,
  published,
}: {
  href: string;
  value: number;
  index: IndexProps;
  published?: boolean;
}) {
  if (published || value > 0) {
    const Icon = Icons[index === 'clicks' ? 'mousePointerClick' : 'bar'];
    return (
      <Link href={href}>
        <Badge className="flex h-4 min-w-max gap-1 px-1 font-normal hover:bg-gray-2">
          <Icon size={14} /> <p>{`${value} ${index}`}</p>
        </Badge>
      </Link>
    );
  }
}
