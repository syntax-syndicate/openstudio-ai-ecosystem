import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { HistorySidebar } from '@/app/(authenticated)/chat/components/side-bar';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { usePrompts } from '@/app/context/prompts/context';
import { useSettings } from '@/app/context/settings/context';
import {
  Command,
  DotsThree,
  GearSix,
  Moon,
  Plus,
  Robot,
  Sun,
  Textbox,
} from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { ComingSoon } from '@repo/design-system/components/ui/coming-soon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { open: openSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const { open: openFilters } = useFilters();
  const { open: openPrompts } = usePrompts();
  const { push } = useRouter();
  const { createSession } = useChatContext();
  const renderNewSession = () => {
    return (
      <Tooltip content="New Session">
        <Button
          size="icon"
          variant={'ghost'}
          className="h-8 min-w-8"
          onClick={() => {
            createSession().then((session) => {
              push(`/chat/${session.id}`);
            });
          }}
        >
          <Plus size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  return (
    <div className="absolute top-0 right-0 left-0 z-50 flex flex-row items-center justify-between bg-gradient-to-b from-70% from-white to-transparent p-2 pb-6 md:p-3 dark:from-zinc-800">
      <div className="flex flex-row items-center gap-2">
        <HistorySidebar />
        <ModelIcon type="chathub" size="md" />
        <p className="text-sm text-zinc-500 md:text-base">ChatHub</p>
        <Badge>Beta</Badge>
      </div>
      <div className="flex flex-row items-center gap-2">
        {renderNewSession()}
        <Button
          variant="ghost"
          size="iconSm"
          onClick={openFilters}
          className="flex md:hidden"
        >
          <Command size={20} weight="bold" />
        </Button>
        <DropdownMenu
          open={isOpen}
          onOpenChange={(open) => {
            document.body.style.pointerEvents = 'auto';
            setIsOpen(open);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconSm">
              <DotsThree size={24} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2 min-w-[250px] text-sm md:text-base">
            <DropdownMenuItem onClick={() => {}}>
              <Robot size={14} weight="bold" />
              Bots <ComingSoon />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openPrompts();
              }}
            >
              <Textbox size={14} weight="bold" />
              Prompts <ComingSoon />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openSettings();
              }}
            >
              <GearSix size={14} weight="bold" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTheme(theme === 'light' ? 'dark' : 'light');
              }}
            >
              {theme === 'light' ? (
                <Moon size={14} weight="bold" />
              ) : (
                <Sun size={14} weight="bold" />
              )}
              Switch to {theme === 'light' ? 'dark' : 'light'} mode
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DropdownMenuContent className="mr-2 min-w-[250px] text-sm md:text-base">
            <DropdownMenuItem
              onClick={() => {
                openSettings();
              }}
            >
              <GearSix size={14} weight="bold" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTheme(theme === 'light' ? 'dark' : 'light');
              }}
            >
              {theme === 'light' ? (
                <Moon size={14} weight="bold" />
              ) : (
                <Sun size={14} weight="bold" />
              )}
              Switch to {theme === 'light' ? 'dark' : 'light'} mode
            </DropdownMenuItem>
            <div className="my-1 h-[1px] w-full bg-black/10 dark:bg-white/10" />
            <DropdownMenuItem onClick={() => {}}>About</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Feedback</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Support</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
