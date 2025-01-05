import { usePreferenceContext } from '@/app/context';
import type { TAssistant } from '@/app/hooks/use-chat-session';
import { useModelList } from '@/app/hooks/use-model-list';
import { defaultPreferences } from '@/app/hooks/use-preferences';
import { DotsThree, Pencil, TrashSimple } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { CommandItem } from '@repo/design-system/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Flex } from '@repo/design-system/components/ui/flex';
import { useState } from 'react';

export type TAssistantItem = {
  assistant: TAssistant;
  onSelect: (assistant: TAssistant) => void;
  onDelete: (assistant: TAssistant) => void;
  onEdit: (assistant: TAssistant) => void;
};

export const AssistantItem = ({
  assistant,
  onSelect,
  onDelete,
  onEdit,
}: TAssistantItem) => {
  const { updatePreferences } = usePreferenceContext();
  const { getAssistantByKey } = useModelList();
  const assistantProps = getAssistantByKey(assistant.key);
  const model = assistantProps?.model;
  const [open, setOpen] = useState(false);

  return (
    <CommandItem
      value={assistant.name}
      className="w-full"
      onSelect={() => {
        updatePreferences(
          {
            defaultAssistant: assistant.key,
            maxTokens: defaultPreferences.maxTokens,
          },
          () => {
            onSelect(assistant);
          }
        );
      }}
    >
      <Flex gap="sm" items="center" key={assistant.key} className="w-full">
        {model?.icon('md')} {assistant.name}{' '}
        {model?.isNew && <Badge>New</Badge>}
        <div className="flex flex-1"></div>
        {assistant.type === 'custom' && (
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Button
                variant="ghost"
                size="iconSm"
                onClick={(e) => {
                  setOpen(true);
                }}
              >
                <DotsThree size={20} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="z-[800] min-w-[200px] text-sm md:text-base"
              align="end"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  onEdit(assistant);

                  e.stopPropagation();
                }}
              >
                <Pencil size={14} weight="bold" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  onDelete(assistant);
                  e.stopPropagation();
                }}
              >
                <TrashSimple size={14} weight="bold" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </Flex>
    </CommandItem>
  );
};
