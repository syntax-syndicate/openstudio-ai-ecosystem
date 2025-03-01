import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useMemo } from 'react';

import { Skeleton } from '@repo/design-system/components/ui/skeleton';

import { UserAvatar } from '@/components/user-avatar';

import { UserInfo } from '@/modules/tube/users/ui/components/user-info';

import type { VideoGetManyOutput } from '../../types';
import { VideoMenu } from './video-menu';

interface VideoInfoProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export const VideoInfoSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-10 flex-shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-5 w-[90%]" />
        <Skeleton className="h-5 w-[70%]" />
      </div>
    </div>
  );
};

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', {
      notation: 'compact',
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={''} name={'Vineeth'} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="line-clamp-1 break-words font-medium text-base lg:line-clamp-2">
            {data.title}
          </h3>
        </Link>
        <Link href={`/users/${data.user.id}`}>
          <UserInfo name={'Vineeth'} />
        </Link>
        <Link href={`/videos/${data.id}`}>
          <p className="line-clamp-1 text-gray-600 text-sm">
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};
