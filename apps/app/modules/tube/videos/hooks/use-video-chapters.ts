import type { MuxPlayerRefAttributes } from '@mux/mux-player-react';
import { type RefObject, useCallback, useEffect } from 'react';

export type Chapter = {
  start: string;
  title: string;
};

type MuxChapter = {
  startTime: number;
  endTime: number;
  value: string;
};

/**
 * Hook to handle adding chapters to a Mux video player and navigating between them
 * @param playerRef - Reference to the Mux player
 * @param chapters - Array of chapters with start time and title
 * @returns Object containing navigation functions
 */
export const useVideoChapters = (
  playerRef: RefObject<MuxPlayerRefAttributes | null>,
  chapters?: Chapter[] | null
) => {
  // Parse chapters and store them for navigation
  const parsedChapters = useCallback(() => {
    if (!chapters?.length) return [];

    return chapters.map((chapter, index, array) => {
      // Parse the timestamp into seconds
      const [hours, minutes, seconds] = chapter.start.split(':').map(Number);
      const startTime = hours * 3600 + minutes * 60 + seconds;

      // Calculate endTime (use next chapter's start time or add 60 seconds for the last chapter)
      let endTime;
      if (index < array.length - 1) {
        const [nextHours, nextMinutes, nextSeconds] = array[index + 1].start
          .split(':')
          .map(Number);
        endTime = nextHours * 3600 + nextMinutes * 60 + nextSeconds;
      } else {
        endTime = startTime + 60; // Add 60 seconds for the last chapter
      }

      return {
        startTime,
        endTime,
        value: chapter.title,
        index,
      };
    });
  }, [chapters]);

  // Add chapters to the player
  useEffect(() => {
    if (chapters?.length && playerRef.current) {
      try {
        const chaptersToAdd = parsedChapters().map(
          ({ startTime, endTime, value }) => ({
            startTime,
            endTime,
            value,
          })
        );

        playerRef.current.addChapters(chaptersToAdd);
        console.log('Chapters added successfully', chaptersToAdd);
      } catch (error) {
        console.error('Error adding chapters:', error);
      }
    }
  }, [chapters, playerRef, parsedChapters]);

  // Function to navigate to a specific chapter by index
  const navigateToChapter = useCallback(
    (chapterIndex: number) => {
      if (!playerRef.current || !chapters?.length) return;

      const chaptersList = parsedChapters();
      if (chapterIndex >= 0 && chapterIndex < chaptersList.length) {
        const targetTime = chaptersList[chapterIndex].startTime;
        playerRef.current.currentTime = targetTime;
        playerRef.current
          .play()
          .catch((err) => console.error('Error playing after seek:', err));
      }
    },
    [playerRef, chapters, parsedChapters]
  );

  // Function to navigate to a specific chapter by title
  const navigateToChapterByTitle = useCallback(
    (chapterTitle: string) => {
      if (!playerRef.current || !chapters?.length) return;

      const chaptersList = parsedChapters();
      const chapter = chaptersList.find((c) => c.value === chapterTitle);

      if (chapter) {
        playerRef.current.currentTime = chapter.startTime;
        playerRef.current
          .play()
          .catch((err) => console.error('Error playing after seek:', err));
      }
    },
    [playerRef, chapters, parsedChapters]
  );

  // Function to navigate to the next chapter
  const navigateToNextChapter = useCallback(() => {
    if (!playerRef.current || !chapters?.length) return;

    const chaptersList = parsedChapters();
    const currentTime = playerRef.current.currentTime;

    // Find the current chapter
    const currentChapterIndex = chaptersList.findIndex(
      (chapter) =>
        currentTime >= chapter.startTime && currentTime < chapter.endTime
    );

    // Navigate to the next chapter if it exists
    if (
      currentChapterIndex >= 0 &&
      currentChapterIndex < chaptersList.length - 1
    ) {
      navigateToChapter(currentChapterIndex + 1);
    }
  }, [playerRef, chapters, parsedChapters, navigateToChapter]);

  // Function to navigate to the previous chapter
  const navigateToPreviousChapter = useCallback(() => {
    if (!playerRef.current || !chapters?.length) return;

    const chaptersList = parsedChapters();
    const currentTime = playerRef.current.currentTime;

    // Find the current chapter
    const currentChapterIndex = chaptersList.findIndex(
      (chapter) =>
        currentTime >= chapter.startTime && currentTime < chapter.endTime
    );

    // If we're more than 3 seconds into the current chapter, go to the start of it
    // Otherwise, go to the previous chapter
    if (currentChapterIndex > 0) {
      const timeIntoChapter =
        currentTime - chaptersList[currentChapterIndex].startTime;
      if (timeIntoChapter > 3) {
        navigateToChapter(currentChapterIndex);
      } else {
        navigateToChapter(currentChapterIndex - 1);
      }
    } else if (currentChapterIndex === 0) {
      // If we're in the first chapter, just go to its beginning
      navigateToChapter(0);
    }
  }, [playerRef, chapters, parsedChapters, navigateToChapter]);

  // Return the navigation functions
  return {
    navigateToChapter,
    navigateToChapterByTitle,
    navigateToNextChapter,
    navigateToPreviousChapter,
    getChapters: parsedChapters,
  };
};
