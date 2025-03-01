import { format, formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';

import { PublishToSocialMediaPlatforms } from '@/components/publish-button';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { VideoDescription } from './video-description';
import { VideoOwner } from './video-owner';

import type { VideoGetOneOutput } from '../../types';

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

export const VideoTopRowSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-4/5 md:w-2/5" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[70%] items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-5 w-4/5 md:w-2/6" />
            <Skeleton className="h-5 w-3/5 md:w-1/5" />
          </div>
        </div>
        <Skeleton className="md:1/6 h-9 w-2/6 rounded-full" />
      </div>
      <div className="h-[120px] w-full" />
    </div>
  );
};

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', {
      notation: 'compact',
    }).format(video.viewCount);
  }, [video.viewCount]);
  const expandedViews = useMemo(() => {
    return Intl.NumberFormat('en', {
      notation: 'standard',
    }).format(video.viewCount);
  }, [video.viewCount]);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, { addSuffix: true });
  }, [video.createdAt]);
  const expandedDate = useMemo(() => {
    return format(video.createdAt, 'd MMM yyyy');
  }, [video.createdAt]);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="font-semibold text-xl">{video.title}</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <VideoOwner user={video.user} videoId={video.id} />
        <PublishToSocialMediaPlatforms videoId={video.id} />
      </div>
      <VideoDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
        description={video.description}
      />
    </div>
  );
};
