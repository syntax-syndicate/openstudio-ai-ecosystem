'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { trpc } from '@/trpc/client';
import { cn } from '@repo/design-system/lib/utils';

import { VideoBanner } from '../components/video-banner';
import { VideoPlayer } from '../components/video-player';
import { VideoPlayerSkeleton } from '../components/video-player';
import { VideoTopRow } from '../components/video-top-row';
import { VideoTopRowSkeleton } from '../components/video-top-row';

interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const utils = trpc.useUtils();

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });

  const handlePlay = () => {
    createView.mutate({ videoId });
  };

  return (
    <>
      <div
        className={cn(
          'relative aspect-video overflow-hidden rounded-xl bg-black',
          video.muxStatus !== 'ready' && 'rounded-b-none'
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
          chapters={Array.isArray(video.chapters) ? video.chapters : null}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
