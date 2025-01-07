import { HistorySidebar } from '@/app/(authenticated)/chat/components/history/history-side-bar';
import { usePromptsContext, useSessions, useSettingsContext } from '@/context';
import {
  Moon02Icon,
  MoreHorizontalIcon,
  NoteIcon,
  PlusSignIcon,
  Settings03Icon,
  Sun01Icon,
} from '@hugeicons/react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const { open: openSettings } = useSettingsContext();
  const { open: openPrompts } = usePromptsContext();
  const [isOpen, setIsOpen] = useState(false);
  const { createSession } = useSessions();
  const renderNewSession = () => {
    return (
      <Tooltip content="New Session" side="left" sideOffset={4}>
        <Button
          size="icon"
          variant={'ghost'}
          className="h-8 min-w-8"
          onClick={() => {
            createSession({
              redirect: true,
            });
          }}
        >
          <PlusSignIcon size={20} variant="solid" />{' '}
        </Button>
      </Tooltip>
    );
  };
  const menuItems = [
    { label: 'About', onClick: () => {} },
    { label: 'Feedback', onClick: () => {} },
    { label: 'Support', onClick: () => {} },
  ];
  return (
    <div className="absolute top-0 bottom-0 left-0 z-[50] flex flex-col items-center justify-center gap-3 border-zinc-50 border-r pb-6 md:p-3 dark:border-white/5">
      <div className="flex flex-row items-center gap-2">
        {renderNewSession()}
      </div>
      <div className="flex flex-col items-center gap-2">
        <HistorySidebar />
      </div>
      <Tooltip content="Prompts" side="left" sideOffset={4}>
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => {
            openPrompts();
          }}
        >
          <NoteIcon size={20} variant="solid" />
        </Button>
      </Tooltip>
      <Flex className="flex-1" />
      <Tooltip content="Preferences" side="left" sideOffset={4}>
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => {
            openSettings();
          }}
        >
          <Settings03Icon size={20} variant="solid" />
        </Button>
      </Tooltip>
      <DropdownMenu
        open={isOpen}
        onOpenChange={(open) => {
          document.body.style.pointerEvents = 'auto';
          setIsOpen(open);
        }}
      >
        <Tooltip content="More" side="left" sideOffset={4}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconSm">
              <MoreHorizontalIcon size={20} variant="solid" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          className="mr-2 min-w-[250px] text-sm md:text-base"
          align="end"
          side="left"
          sideOffset={4}
        >
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.onClick}>
              {item.label}
            </DropdownMenuItem>
          ))}
          <div className="my-1 h-[1px] w-full bg-black/10 dark:bg-white/10" />
          <DropdownMenuItem
            onClick={() => {
              setTheme(theme === 'light' ? 'dark' : 'light');
            }}
          >
            {theme === 'light' ? (
              <Moon02Icon size={18} variant="stroke" strokeWidth="2" />
            ) : (
              <Sun01Icon size={18} variant="stroke" strokeWidth="2" />
            )}
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
