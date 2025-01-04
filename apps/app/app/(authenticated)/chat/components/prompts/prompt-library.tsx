import { type TPrompt, usePrompts } from '@/app/hooks/use-prompts';
import { BookBookmark, FolderSimple, Plus } from '@phosphor-icons/react';
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

export type TPromptLibrary = {
  open: boolean;
  tab: 'public' | 'local';
  onTabChange: (tab: 'public' | 'local') => void;
  onCreate: () => void;
};

export const PromptLibrary = ({
  open,
  tab,
  onCreate,
  onTabChange,
}: TPromptLibrary) => {
  const [localPrompts, setLocalPrompts] = useState<TPrompt[]>([]);
  const { getPrompts } = usePrompts();
  const query = useQuery<{ prompts: TPrompt[] }>({
    queryKey: ['prompts'],
    queryFn: async () => axios.get('/api/prompts').then((res) => res.data),
  });
  useEffect(() => {
    getPrompts().then((prompts) => {
      setLocalPrompts(prompts);
    });
  }, [open]);
  return (
    <Command>
      <div className="w-full p-1">
        <CommandInput placeholder="Search Prompts" />
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
              <BookBookmark size={16} weight="bold" /> Prompt Library
            </Button>
            <Button
              size="sm"
              variant={tab === 'local' ? 'secondary' : 'ghost'}
              onClick={() => {
                onTabChange('local');
              }}
            >
              <FolderSimple size={16} weight="bold" /> Your prompts
            </Button>
          </div>
          <Button size="sm" onClick={onCreate}>
            <Plus size={16} weight="bold" /> Create Prompt
          </Button>
        </div>
        <CommandEmpty className="flex w-full flex-col items-center justify-center gap-2 p-4 text-sm text-zinc-500">
          No prompts found{' '}
          <Button variant="outline" size="sm" onClick={onCreate}>
            Create new prompt
          </Button>
        </CommandEmpty>
        <CommandList className="px-2 py-2">
          {(tab === 'local' ? localPrompts : query?.data?.prompts)?.map(
            (prompt) => (
              <CommandItem
                value={prompt.name}
                key={prompt.id}
                className="w-full"
              >
                <div className="flex w-full flex-row items-center justify-start gap-2 overflow-hidden p-1">
                  <div className="flex w-full flex-col items-start gap-0 py-2">
                    <p className="font-medium text-base">{prompt.name}</p>
                    <p className="line-clamp-2 w-full text-xs text-zinc-500">
                      {prompt.content}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Use this
                  </Button>
                </div>
              </CommandItem>
            )
          )}
        </CommandList>
      </div>
    </Command>
  );
};
