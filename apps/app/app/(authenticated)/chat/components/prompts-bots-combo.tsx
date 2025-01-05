import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { useBots } from '@/app/context/bots/context';
import { usePrompts } from '@/app/context/prompts/context';
import type { TBot } from '@/app/hooks/use-bots';
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
  onBotSelect?: (prompt: TBot) => void;
  onBack: () => void;
};
export const PromptsBotsCombo = ({
  open,
  children,
  onOpenChange,
  onBack,
  onBotSelect,
  onPromptSelect,
}: TPromptsBotsCombo) => {
  const [commandInput, setCommandInput] = useState('');
  const { open: openPrompts, allPrompts } = usePrompts();
  const { open: openBot, allBots, assignBot } = useBots();
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor className="w-full">{children}</PopoverAnchor>
      <PopoverContent
        side="top"
        sideOffset={4}
        className="min-w-[96vw] overflow-hidden rounded-2xl p-0 md:min-w-[700px]"
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
            <CommandItem
              onSelect={() => {
                openBot('create');
              }}
            >
              <Plus size={14} weight="bold" className="flex-shrink-0" /> Create
              New Bot
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
            {!!allBots?.length && (
              <CommandGroup heading="Bots">
                {allBots?.map((bot, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      assignBot(bot);
                      onBotSelect && onBotSelect(bot);
                      onOpenChange(false);
                    }}
                  >
                    <BotAvatar
                      name={bot.name}
                      size="small"
                      avatar={bot?.avatar}
                    />{' '}
                    {bot.name}
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
