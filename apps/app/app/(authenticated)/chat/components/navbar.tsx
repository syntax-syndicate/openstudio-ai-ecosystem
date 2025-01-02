import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { useSettings } from '@/app/context/settings/context';
import { DotsThree, GearSix, Moon, Sun } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { open: openSettings } = useSettings();
  return (
    <div className="absolute top-0 right-0 left-0 z-10 flex flex-row items-center justify-between bg-gradient-to-b from-70% p-4 dark:from-zinc-800 dark:to-transparent">
      <div className="flex flex-row items-center gap-2">
        <ModelIcon type="chathub" size="md" />
        <p className="text-sm text-zinc-500">ChatHub</p>
        <Badge>Beta</Badge>
      </div>
      <div className="flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="iconSm">
              <DotsThree size={20} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[200px] text-sm">
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
        </DropdownMenu>
      </div>
    </div>
  );
};
