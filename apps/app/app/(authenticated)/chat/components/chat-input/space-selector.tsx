import { FolderLibraryIcon } from '@hugeicons/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import type { FC } from 'react';

export type SpaceSelector = {};

export const SpaceSelector: FC<SpaceSelector> = () => {
  return (
    <Tooltip content="Spaces (coming soon)" side="top" sideOffset={4}>
      <Popover>
        <PopoverTrigger>
          <Button size="iconSm" variant="ghost">
            <FolderLibraryIcon size={18} strokeWidth={2} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <Flex className="p-4" direction="col" items="center" justify="center">
            <FolderLibraryIcon
              size={18}
              strokeWidth={2}
              className="mb-2 text-zinc-500"
            />
            <Type size="sm" textColor="secondary">
              Knowledge Spaces
            </Type>
            <Type size="sm" textColor="tertiary">
              (coming soon)
            </Type>
          </Flex>
        </PopoverContent>
      </Popover>
    </Tooltip>
  );
};
