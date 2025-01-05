import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import type { TBot } from '@/app/hooks/use-bots';
import {
  BookBookmark,
  DotsThree,
  FolderSimple,
  Plus,
  TrashSimple,
} from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';

export type TBotLibrary = {
  open: boolean;
  tab: 'public' | 'local';
  localBots: TBot[];
  publicBots: TBot[];
  onTabChange: (tab: 'public' | 'local') => void;
  onCreate: () => void;
  onDelete: (bot: TBot) => void;
  assignBot: (Bot: TBot) => void;
};

export const BotLibrary = ({
  open,
  tab,
  onCreate,
  onTabChange,
  localBots,
  publicBots,
  assignBot,
  onDelete,
}: TBotLibrary) => {
  return (
    <Command>
      <div className="w-full p-1">
        <CommandInput placeholder="Search Bots" />
      </div>

      <div className="relative flex h-full w-full flex-col border-zinc-500/20 border-t">
        <div className="flex w-full flex-row justify-between px-3 pt-3 pb-3">
          <div className="flex flex-row items-center gap-2">
            <Button
              size="sm"
              variant={tab === 'public' ? 'secondary' : 'ghost'}
              onClick={() => {
                onTabChange('public');
              }}
            >
              <BookBookmark size={16} weight="bold" /> Bot Library
            </Button>

            <Button
              size="sm"
              variant={tab === 'local' ? 'secondary' : 'ghost'}
              onClick={() => {
                onTabChange('local');
              }}
            >
              <FolderSimple size={16} weight="bold" /> Your Bots
            </Button>
          </div>
          <Button size="sm" onClick={onCreate}>
            <Plus size={16} weight="bold" /> Create Bot
          </Button>
        </div>
        <CommandEmpty className="flex w-full flex-col items-center justify-center gap-2 p-4 text-sm text-zinc-500">
          No Bots found{' '}
          <Button variant="outline" size="sm" onClick={onCreate}>
            Create new Bot
          </Button>
        </CommandEmpty>
        <CommandList className="px-2 py-2">
          {(tab === 'local' ? localBots : publicBots)?.map((bot) => (
            <CommandItem
              value={bot.name}
              key={bot.id}
              className="!px-2 w-full"
              onSelect={(value) => {
                assignBot(bot);
              }}
            >
              <div className="flex w-full flex-row items-center justify-start gap-3 overflow-hidden p-1">
                <BotAvatar name={bot.name} size="medium" avatar={bot?.avatar} />
                <div className="flex w-full flex-col items-start gap-0">
                  <p className="font-medium text-sm">{bot.name}</p>
                  <p className="line-clamp-1 w-full text-xs text-zinc-500">
                    {bot.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="iconSm">
                      <DotsThree size={24} weight="bold" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="min-w-[200px] text-sm md:text-base"
                    align="end"
                  >
                    <DropdownMenuItem
                      onClick={(e) => {
                        onDelete(bot);
                        e.stopPropagation();
                      }}
                    >
                      <TrashSimple size={14} weight="bold" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </div>
    </Command>
  );
};
