import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { HistorySidebar } from '@/app/(authenticated)/chat/components/history/history-side-bar';
import { useSessions } from '@/context';
import { FolderLibraryIcon, HelpCircleIcon } from '@hugeicons/react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  Moon02Icon,
  PlusSignIcon,
  Settings03Icon,
  Sun01Icon,
} from '@repo/design-system/components/ui/icons';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import Avatar from 'boring-avatars';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { createSession } = useSessions();
  const { renderModal, setOpen: openFeedback } = useFeedback();

  const renderNewSession = () => {
    return (
      <Tooltip content="New Session" side="left" sideOffset={4}>
        <Button
          size="icon"
          variant={'ghost'}
          className="h-8 min-w-8"
          onClick={() => {
            push('/chat');
            createSession({
              redirect: true,
            });
          }}
        >
          <PlusSignIcon size={20} strokeWidth={2} />
        </Button>
      </Tooltip>
    );
  };

  const menuItems = [
    { label: 'About', onClick: () => {} },
    {
      label: 'Feedback',
      onClick: () => {
        openFeedback(true);
      },
    },
    { label: 'Support', onClick: () => {} },
  ];

  const renderSpaces = () => {
    return (
      <Tooltip content="Spaces (coming soon)" side="left" sideOffset={4}>
        <Button size="iconSm" variant="ghost">
          <FolderLibraryIcon size={20} strokeWidth={2} />
        </Button>
      </Tooltip>
    );
  };

  const renderSettings = () => {
    return (
      <Tooltip content="Settings" side="left" sideOffset={4}>
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => {
            push('/chat/settings');
          }}
        >
          <Settings03Icon size={20} strokeWidth={2} />
        </Button>
      </Tooltip>
    );
  };

  const renderHelpSupport = () => {
    return (
      <DropdownMenu
        open={isOpen}
        onOpenChange={(open: boolean) => {
          document.body.style.pointerEvents = 'auto';
          setIsOpen(open);
        }}
      >
        <Tooltip content="More" side="top" sideOffset={2}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed right-4 bottom-4 z-10"
            >
              <HelpCircleIcon size={28} variant="solid" />
            </Button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          className="mr-2 min-w-[250px] text-sm md:text-base"
          align="end"
          side="top"
          sideOffset={2}
        >
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index} onClick={item.onClick}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderProfile = () => {
    return (
      <DropdownMenu>
        <Tooltip content="More" side="left" sideOffset={4}>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer rounded-full p-1 outline-none ring-2 ring-zinc-500/20 hover:ring-zinc-500/30 focus:outline-none focus:ring-zinc-500/30">
              <Avatar
                name={'ChatHub'}
                variant="beam"
                size={28}
                colors={['#4A2BE2', '#D5EC77', '#3EE2DE', '#AF71FF', '#F882B3']}
              />
            </div>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent
          className="mr-2 min-w-[250px] text-sm md:text-base"
          align="end"
          side="left"
          sideOffset={4}
        >
          <Flex className="items-center p-2" gap="md">
            <Avatar
              name={'ChatHub'}
              variant="beam"
              size={44}
              colors={['#4A2BE2', '#D5EC77', '#3EE2DE', '#AF71FF', '#F882B3']}
            />
            <Type>ChatHub</Type>
          </Flex>
          <div className="my-1 h-[1px] w-full bg-black/10 dark:bg-white/10" />
          <DropdownMenuItem
            onClick={() => {
              push('/settings');
            }}
          >
            <Settings03Icon size={20} strokeWidth={2} />
            Settings
          </DropdownMenuItem>{' '}
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
    );
  };

  return (
    <>
      <div className="group fixed z-10 flex w-full flex-row items-center justify-center gap-3 border-zinc-500/10 p-3 md:h-screen md:w-auto md:flex-col md:border-r dark:border-zinc-500/5">
        <div className="flex flex-row items-center gap-2">
          {renderNewSession()}
        </div>
        <div className="flex flex-col items-center gap-2">
          <HistorySidebar />
        </div>

        {renderSpaces()}

        <Flex className="flex-1" />
        {renderSettings()}
        {renderProfile()}

        {renderModal()}
      </div>
      {renderHelpSupport()}
    </>
  );
};
