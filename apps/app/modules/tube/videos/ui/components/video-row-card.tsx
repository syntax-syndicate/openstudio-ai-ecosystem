import Link from 'next/link';
import { useMemo } from 'react';

import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { type VariantProps, cn, cva } from '@repo/design-system/lib/utils';

import { UserAvatar } from '@/components/user-avatar';
import { UserInfo } from '@/modules/tube/users/ui/components/user-info';

import type { VideoGetManyOutput } from '../../types';
import { VideoMenu } from './video-menu';
import { VideoThumbnail, VideoThumbnailSkeleton } from './video-thumbnail';

const videoRowCardVariants = cva('group flex min-w-0', {
  variants: {
    size: {
      default: 'gap-4',
      compact: 'gap-2',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const thumbnailVariants = cva('relative flex-none', {
  variants: {
    size: {
      default: 'w-[38%]',
      compact: 'w-[168px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export const VideoRowCardSkeleton = ({
  size = 'default',
}: VariantProps<typeof videoRowCardVariants>) => {
  return (
    <div className={videoRowCardVariants({ size })}>
      {/* Thumbnail skeleton */}
      <div className={thumbnailVariants({ size })}>
        <VideoThumbnailSkeleton />
      </div>

      {/* Info skeleton */}
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <div className="min-w-0 flex-1">
            <Skeleton
              className={cn('h-5 w-[40%]', size === 'compact' && 'h-4 w-[40%]')}
            />
            {size === 'default' && (
              <>
                <Skeleton className="mt-1 h-4 w-[20%]" />
                <div className="my-3 flex items-center gap-2">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            )}
            {size === 'compact' && (
              <>
                <Skeleton className="mt-1 h-4 w-[50%]" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoRowCard = ({
  data,
  size = 'default',
  onRemove,
}: VideoRowCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', {
      notation: 'compact',
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat('en', {
      notation: 'compact',
    }).format(data.likeCount);
  }, [data.likeCount]);

  return (
    <div className={videoRowCardVariants({ size })}>
      <Link
        href={`/tube/home/videos/${data.id}`}
        className={thumbnailVariants({ size })}
      >
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration ?? 0}
        />
      </Link>

      {/* Info*/}
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-x-2">
          <Link
            href={`/tube/home/videos/${data.id}`}
            className="min-w-0 flex-1"
          >
            <h3
              className={cn(
                'line-clamp-2 font-medium',
                size === 'compact' ? 'text-sm' : 'text-base'
              )}
            >
              {data.title}
            </h3>
            {size === 'default' && (
              <p className="mt-1 text-muted-foreground text-xs">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
            {size === 'default' && (
              <>
                <div className="my-3 flex items-center gap-2">
                  <UserAvatar
                    size="sm"
                    imageUrl={data.user.imageUrl ?? ''}
                    name={data.user.name ?? 'Vineeth'}
                  />
                  <UserInfo size="sm" name={data.user.name ?? 'Vineeth'} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="line-clamp-2 w-fit text-muted-foreground text-xs">
                      {data.description ?? 'No description'}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    <p>From the video description</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {size === 'compact' && (
              <UserInfo size="sm" name={data.user.name ?? 'Vineeth'} />
            )}
            {size === 'compact' && (
              <p className="mt-1 text-muted-foreground text-xs">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
};
