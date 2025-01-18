import { AssistantItem } from '@/app/(authenticated)/chat/components/assistants/assistant-item';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { providers } from '@/config/models';
import { usePreferenceContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TAssistant } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Command,
  CommandInput,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { CommandGroup } from '@repo/design-system/components/ui/command';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';

export type TAssitantModal = {
  selectedAssistantKey: string;
  onAssistantchange: (assistantKey: string) => void;
};

export const AssistantModal: FC<TAssitantModal> = ({
  selectedAssistantKey,
  onAssistantchange,
}) => {
  const { getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  const { preferences, updatePreferences } = usePreferenceContext();
  const [open, setOpen] = useState(false);
  const { assistants } = useAssistantUtils();

  const searchRef = useRef<HTMLInputElement>(null);

  const baseAssistants = assistants?.filter((a) => a.type === 'base');

  const selectedAssistant = getAssistantByKey(selectedAssistantKey);

  useEffect(() => {
    onAssistantchange(preferences.defaultAssistant);
  }, [preferences]);

  const renderAssistants = (assistants: TAssistant[]) => {
    return assistants?.map((assistant) => {
      return (
        <AssistantItem
          key={assistant.key}
          assistant={assistant}
          onSelect={(assistant) => {
            onAssistantchange(assistant.key);
            setOpen(false);
          }}
        />
      );
    });
  };

  const [search, setSearch] = useState('');
  const [openProviders, setOpenProviders] = useState(['chathub']);

  useEffect(() => {
    if (search) {
      setOpenProviders([...providers]);
    }
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="bordered" size="sm" className="gap-1 pr-3 pl-1.5">
          {selectedAssistant?.assistant?.key &&
            getAssistantIcon(selectedAssistant?.assistant?.key, 'sm')}
          {selectedAssistant?.assistant?.name}
          <ChevronDown size={14} strokeWidth="2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mr-8 w-[380px] rounded-xl p-0 dark:bg-zinc-700"
        side="bottom"
        align="start"
      >
        <Command className="relative h-full max-h-[450px] overflow-hidden rounded-xl dark:bg-zinc-700">
          <div className="h-11 w-full px-2">
            <CommandInput
              placeholder="Search assistants..."
              className="h-11"
              ref={searchRef}
              value={search}
              onValueChange={setSearch}
            />
          </div>

          <CommandList className="!max-h-[50vh] h-full overflow-y-auto">
            <Accordion
              type="multiple"
              value={openProviders}
              onValueChange={(val) => setOpenProviders(val)}
            >
              {providers?.map((provider: any) => {
                return (
                  <CommandGroup key={provider} value={provider}>
                    <AccordionItem
                      value={provider}
                      className="!border-t !border-b-transparent"
                    >
                      <AccordionTrigger className="px-2 py-2">
                        <Flex gap="sm">
                          <ModelIcon type={provider} size="sm" />
                          {provider}
                          {provider === 'chathub' && (
                            <Badge variant="tertiary">Free</Badge>
                          )}
                        </Flex>
                      </AccordionTrigger>
                      <AccordionContent className="!p-0 !pt-2">
                        {renderAssistants(
                          baseAssistants?.filter(
                            (assistant) => assistant.provider === provider
                          )
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </CommandGroup>
                );
              })}
            </Accordion>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
