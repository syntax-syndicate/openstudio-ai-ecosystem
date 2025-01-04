import { type TBot, useBots } from '@/app/hooks/use-bots';
import { BookBookmark, FolderSimple, Plus } from '@phosphor-icons/react';
import { BotAvatar } from '@repo/design-system/components/ui/bot-avatar';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

export type TBotLibrary = {
  open: boolean;
  tab: 'public' | 'local';
  onTabChange: (tab: 'public' | 'local') => void;
  onCreate: () => void;
  assignBot: (Bot: TBot) => void;
};

export const BotLibrary = ({
  open,
  tab,
  onCreate,
  onTabChange,
  assignBot,
}: TBotLibrary) => {
  const [localBots, setLocalBots] = useState<TBot[]>([]);
  const { getBots } = useBots();
  const query = useQuery<{ Bots: TBot[] }>({
    queryKey: ['Bots'],
    queryFn: async () => axios.get('/api/Bots').then((res) => res.data),
  });
  useEffect(() => {
    getBots().then((Bots) => {
      console.log(Bots);
      setLocalBots(Bots);
    });
  }, [open]);
  return (
    <Command>
      <div className="w-full p-1">
        <CommandInput placeholder="Search Bots" />
      </div>
      <div className="relative mt-60 flex h-full w-full flex-col border-zinc-500/20 border-t md:mt-0">
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
          {(tab === 'local' ? localBots : query?.data?.Bots)?.map((Bot) => (
            <CommandItem
              value={Bot.name}
              key={Bot.id}
              className="!px-2 w-full"
              onSelect={(value) => {
                assignBot(Bot);
              }}
            >
              <div className="flex w-full flex-row items-center justify-start gap-2 overflow-hidden p-1">
                <BotAvatar name={Bot.name} size={40} />
                <div className="flex w-full flex-col items-start gap-0">
                  <p className="font-medium text-base">{Bot.name}</p>
                  <p className="line-clamp-1 w-full text-xs text-zinc-500">
                    {Bot.description}
                  </p>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </div>
    </Command>
  );
};
