'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { cn } from '@repo/design-system/lib/utils';
import { Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
}

export const EmojiPicker = ({
  onEmojiSelect,
  buttonClassName,
}: EmojiPickerProps) => {
  const { theme, systemTheme } = useTheme();

  const emojiTheme = useMemo(() => {
    switch (theme) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'system':
        return systemTheme || 'light';
      default:
        return 'light';
    }
  }, [theme, systemTheme]);

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('h-8 w-8 rounded-full p-0', buttonClassName)}
          aria-label="Add emoji"
        >
          <Smile className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full border-none p-0"
        align="start"
        side="top"
      >
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme={emojiTheme}
          emojiSize={20}
          emojiButtonSize={28}
          previewPosition="none"
        />
      </PopoverContent>
    </Popover>
  );
};
