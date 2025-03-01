import type { MuxPlayerRefAttributes } from '@mux/mux-player-react';
import { type ReactNode, createContext, useRef } from 'react';
import { type Chapter, useVideoChapters } from '../hooks/use-video-chapters';

interface VideoPlayerContextType {
  playerRef: React.RefObject<MuxPlayerRefAttributes | null>;
  navigateToTimestamp: (seconds: number) => void;
  chapters?: Chapter[];
}

export const VideoPlayerContext = createContext<VideoPlayerContextType | null>(
  null
);

interface VideoPlayerProviderProps {
  children: ReactNode;
  chapters?: Chapter[];
}

export const VideoPlayerProvider = ({
  children,
  chapters,
}: VideoPlayerProviderProps) => {
  const playerRef = useRef<MuxPlayerRefAttributes | null>(null);
  const { navigateToChapter } = useVideoChapters(playerRef, chapters);

  // Add a global function for the onClick handlers
  if (typeof window !== 'undefined') {
    window.navigateToVideoTime = (seconds: number) => {
      if (playerRef.current) {
        playerRef.current.currentTime = seconds;
        playerRef.current
          .play()
          .catch((err) => console.error('Error playing after seek:', err));
      }
    };
  }

  const navigateToTimestamp = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime = seconds;
      playerRef.current
        .play()
        .catch((err) => console.error('Error playing after seek:', err));
    }
  };

  return (
    <VideoPlayerContext.Provider
      value={{ playerRef, navigateToTimestamp, chapters }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};
