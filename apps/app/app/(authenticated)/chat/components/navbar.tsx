import { HistorySidebar } from '@/app/(authenticated)/chat/components/history/history-side-bar';
import { useBots } from '@/app/context/bots/context';
import { useFilters } from '@/app/context/filters/context';
import { usePrompts } from '@/app/context/prompts/context';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { useSettings } from '@/app/context/settings/context';
import {
  Book,
  DotsThree,
  GearSix,
  Moon,
  Plus,
  Robot,
  Sun,
} from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { open: openSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const { open: openFilters } = useFilters();
  const { open: openPrompts } = usePrompts();
  const { open: openBots } = useBots();
  const { createSession } = useSessionsContext();
  const renderNewSession = () => {
    return (
      <Tooltip content="New Session">
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
          <Plus size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  return (
    <div className="absolute top-0 right-0 left-0 z-50 flex flex-row items-center justify-between bg-gradient-to-b from-70% from-white to-transparent p-2 pb-6 md:p-3 dark:from-zinc-800">
      <div className="flex flex-row items-center gap-2">
        {renderNewSession()}
        {/* <ModelIcon type="chathub" size="md" />
        <p className="text-sm text-zinc-500 md:text-base">ChatHub</p>
        <Badge>Beta</Badge> */}
      </div>
      <div className="flex flex-row items-center gap-2">
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
                openBots();
              }}
            >
              <Robot size={14} weight="bold" />
              Bots
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openPrompts();
              }}
            >
              <Book size={14} weight="bold" />
              Prompts
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openSettings();
              }}
            >
              <GearSix size={14} weight="bold" />
              Settings
            </DropdownMenuItem>

            <div className="my-1 h-[1px] w-full bg-black/10 dark:bg-white/10" />
            <DropdownMenuItem onClick={() => {}}>About</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Feedback</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Support</DropdownMenuItem>
            <div className="my-1 h-[1px] w-full bg-black/10 dark:bg-white/10" />

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
        </DropdownMenu>
        <HistorySidebar />
      </div>
    </div>
  );
};
