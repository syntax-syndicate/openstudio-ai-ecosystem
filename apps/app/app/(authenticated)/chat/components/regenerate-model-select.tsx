import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { ArrowClockwise } from '@phosphor-icons/react';
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
  onRegenerate: (modelKey: TModelKey) => void;
};

export const RegenerateWithModelSelect = ({
  onRegenerate,
}: TRegenerateModelSelect) => {
  const { assistants, getAssistantByKey } = useModelList();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip content="Regenerate">
          <DropdownMenuTrigger asChild>
            {
              <Button variant="ghost" size="iconSm" rounded="lg">
                <ArrowClockwise size={16} weight="bold" />
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
