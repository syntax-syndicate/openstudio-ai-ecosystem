'use client';

import { useTubeContext } from '@/modules/tube/providers/tube-provider';
import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';
import { SearchInput } from './search-input';

interface TubeNavbarProps {
  title?: string;
  showBackButton?: boolean;
  children?: ReactNode;
  borderBottom?: boolean;
}

export const TubeNavbar = ({
  title,
  showBackButton = false,
  children,
  borderBottom = true,
}: TubeNavbarProps) => {
  const { isSidebarOpen, setIsSidebarOpen } = useTubeContext();
  return (
    <Flex
      className={cn(
        'sticky top-0 z-20 flex w-full rounded-t-md border-zinc-500/10 bg-zinc-25 p-1 md:p-2 dark:bg-zinc-800',
        borderBottom ? 'border-b' : ''
      )}
      direction="col"
    >
      <Flex
        direction="row"
        gap="xs"
        justify="between"
        items="center"
        className="w-full"
      >
        <Flex gap="xs" items="center">
          <Button
            variant="ghost"
            size="icon-sm"
            className="flex lg:hidden"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            {isSidebarOpen ? (
              <ArrowLeftDoubleIcon size={16} strokeWidth={2} />
            ) : (
              <ArrowRightDoubleIcon size={16} strokeWidth={2} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden lg:flex"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            {isSidebarOpen ? (
              <ArrowLeftDoubleIcon size={16} strokeWidth={2} />
            ) : (
              <ArrowRightDoubleIcon size={16} strokeWidth={2} />
            )}
          </Button>
          {title && <Type weight="medium">{title}</Type>}
          {children}
        </Flex>
        <div className="flex max-w-[720px] flex-1 justify-center">
          <SearchInput />
        </div>
      </Flex>
    </Flex>
  );
};
