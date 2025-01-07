import { useModelList } from '@/hooks/use-model-list';
import type { TAssistant, TModelKey } from '@/types';
import { ArrowDown01Icon, SparklesIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useState } from 'react';

export type TRegenerateModelSelect = {
  assistant: TAssistant;
  onRegenerate: (modelKey: TModelKey) => void;
};

export const RegenerateWithModelSelect = ({
  assistant,
  onRegenerate,
}: TRegenerateModelSelect) => {
  const { assistants, getAssistantByKey } = useModelList();
  const [isOpen, setIsOpen] = useState(false);

  const messageAssistantProps = getAssistantByKey(assistant.key);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip content="Regenerate">
          <DropdownMenuTrigger asChild>
            {
              <Button variant="ghost" size="sm" rounded="lg">
                <SparklesIcon size={18} variant="stroke" strokeWidth="2" />
                {messageAssistantProps?.model?.name}
                <ArrowDown01Icon size={16} variant="stroke" strokeWidth="2" />
              </Button>
            }
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="no-scrollbar h-[300px] min-w-[250px] overflow-y-auto">
          {assistants.map((assistant) => {
            const assistantProps = getAssistantByKey(assistant.key);
            return (
              <DropdownMenuItem
                key={assistant.key}
                onClick={() => {
                  onRegenerate(assistant.key);
                }}
              >
                {assistantProps?.model.icon('sm')}{' '}
                {assistantProps?.assistant.name}{' '}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
