import { useChatContext } from '@/app/context/chat/provider';
import type { TPrompt } from '@/app/hooks/use-prompts';
import { BookBookmark, FolderSimple, Plus } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';

export type TPromptLibrary = {
  open: boolean;
  onPromptSelect: (prompt: TPrompt) => void;
  tab: 'public' | 'local';
  publicPrompts: TPrompt[];
  localPrompts: TPrompt[];
  onTabChange: (tab: 'public' | 'local') => void;
  onCreate: () => void;
};

export const PromptLibrary = ({
  open,
  onPromptSelect,
  tab,
  publicPrompts,
  localPrompts,
  onCreate,
  onTabChange,
}: TPromptLibrary) => {
  const { editor } = useChatContext();

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
          {(tab === 'local' ? localPrompts : publicPrompts)?.map((prompt) => (
            <CommandItem
              value={prompt.name}
              key={prompt.id}
              className="w-full"
              onSelect={() => {
                onPromptSelect(prompt);
              }}
            >
              <div className="flex w-full flex-row items-center justify-start gap-2 overflow-hidden px-2">
                <div className="flex w-full flex-col items-start gap-0 py-2">
                  <p className="font-medium text-base">{prompt.name}</p>
                  <p className="line-clamp-1 w-full text-xs text-zinc-500">
                    {prompt.content}
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
