import { useChatContext } from '@/app/context';
import type { TPrompt } from '@/app/hooks';
import { DotsThree, Note, Pencil, TrashSimple } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
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

export type TPromptLibrary = {
  open: boolean;
  onPromptSelect: (prompt: TPrompt) => void;
  tab: 'public' | 'local';
  publicPrompts: TPrompt[];
  localPrompts: TPrompt[];
  onEdit: (prompt: TPrompt) => void;
  onDelete: (prompt: TPrompt) => void;
  onTabChange: (tab: 'public' | 'local') => void;
  onCreate: () => void;
};

export const PromptLibrary = ({
  open,
  onPromptSelect,
  tab,
  localPrompts,
  publicPrompts,
  onCreate,
  onTabChange,
  onEdit,
  onDelete,
}: TPromptLibrary) => {
  const { editor } = useChatContext();

  return (
    <Command>
      <div className="w-full p-1">
        <CommandInput placeholder="Search Prompts" />
      </div>

      <div className="relative flex h-full w-full flex-col">
        <CommandEmpty className="flex w-full flex-col items-center justify-center gap-2 p-4 text-sm text-zinc-500">
          No prompts found
          <Button variant="outline" size="sm" onClick={onCreate}>
            Create new prompt
          </Button>
        </CommandEmpty>

        <CommandList className="px-2 pb-2">
          <CommandItem
            value={'Create prompt'}
            className="w-full"
            onSelect={onCreate}
          >
            <Pencil size={18} weight="bold" />
            Create Prompt
          </CommandItem>
          <CommandGroup heading="Prompts Collections">
            {[...localPrompts, ...publicPrompts]?.map((prompt) => (
              <CommandItem
                value={prompt.name}
                key={prompt.id}
                className="w-full"
                onSelect={() => {
                  onPromptSelect(prompt);
                }}
              >
                <Note size={20} weight="bold" />
                {prompt.name}
                {tab === 'local' && (
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
                          onEdit(prompt);
                          e.stopPropagation();
                        }}
                      >
                        <Pencil size={14} weight="bold" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          onDelete(prompt);
                          e.stopPropagation();
                        }}
                      >
                        <TrashSimple size={14} weight="bold" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </div>
    </Command>
  );
};
