'use client';

import { THUMBNAIL_FALLBACK } from '@/lib/constants';
import type { Chapter } from '@/modules/tube/videos/hooks/use-video-chapters';
import { useVideoChapters } from '@/modules/tube/videos/hooks/use-video-chapters';
import MuxPlayer, { type MuxPlayerRefAttributes } from '@mux/mux-player-react';
import { useRef } from 'react';

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
  chapters?: Chapter[] | null;
}

export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video rounded-xl bg-black" />;
};

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
  chapters,
}: VideoPlayerProps) => {
  // if (!playbackId) return null;

  const playerRef = useRef<MuxPlayerRefAttributes | null>(null);

  useVideoChapters(playerRef, chapters);

  return (
    <MuxPlayer
      ref={playerRef}
      playbackId={playbackId || ''}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className="h-full w-full object-contain"
      accentColor="#fb0909"
      onPlay={onPlay}
    />
  );
};
