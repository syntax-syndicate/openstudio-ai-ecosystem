import { usePromptsContext } from '@/app/context';
import type { TPrompt } from '@/app/hooks/use-prompts';
import { Plus } from '@phosphor-icons/react';
import {
  Command as CMDKCommand,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@repo/design-system/components/ui/popover';
import { useState } from 'react';

export type TPromptsBotsCombo = {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromptSelect: (prompt: TPrompt) => void;
  onBack: () => void;
};
export const PromptsBotsCombo = ({
  open,
  children,
  onOpenChange,
  onBack,
  onPromptSelect,
}: TPromptsBotsCombo) => {
  const [commandInput, setCommandInput] = useState('');
  const { open: openPrompts, allPrompts } = usePromptsContext();

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor className="w-full">{children}</PopoverAnchor>
      <PopoverContent
        side="top"
        sideOffset={4}
        className="min-w-[96vw] overflow-hidden rounded-2xl p-0 md:min-w-[700px] lg:min-w-[720px]"
      >
        <CMDKCommand>
          <CommandInput
            placeholder="Search..."
            className="h-10"
            value={commandInput}
            onValueChange={setCommandInput}
            onKeyDown={(e) => {
              if (
                (e.key === 'Delete' || e.key === 'Backspace') &&
                !commandInput
              ) {
                onOpenChange(false);
                onBack();
              }
            }}
          />
          <CommandEmpty>No Prompts found.</CommandEmpty>
          <CommandList className="max-h-[160px] p-2">
            <CommandItem
              onSelect={() => {
                openPrompts('create');
              }}
            >
              <Plus size={14} weight="bold" className="flex-shrink-0" /> Create
              New Prompt
            </CommandItem>
            {!!allPrompts?.length && (
              <CommandGroup heading="Prompts">
                {allPrompts?.map((prompt, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      onPromptSelect(prompt);
                    }}
                  >
                    {prompt.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </CMDKCommand>
      </PopoverContent>
    </Popover>
  );
};
