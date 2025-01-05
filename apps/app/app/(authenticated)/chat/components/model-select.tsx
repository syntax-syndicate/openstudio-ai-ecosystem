import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';

export type TModelSelect = {
  selectedModel: TModelKey;
  fullWidth?: boolean;
  variant?: 'outline' | 'ghost' | 'default' | 'secondary';
  setSelectedModel: (model: TModelKey) => void;
  className?: string;
};

export const ModelSelect = ({
  selectedModel,
  variant,
  fullWidth,
  setSelectedModel,
  className,
}: TModelSelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getModelByKey, models, assistants, getAssistantByKey } =
    useModelList();

  const activeAssistant = getAssistantByKey(selectedModel);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || 'ghost'}
            className={cn('gap-2 pr-3 pl-1 text-xs md:text-sm', className)}
            size="sm"
          >
            {activeAssistant?.model?.icon('sm')}{' '}
            {activeAssistant?.assistant.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={4}
          className={cn(
            'no-scrollbar z-[600] max-h-[260px] overflow-y-auto text-xs md:text-sm',
            fullWidth ? 'w-full' : 'min-w-[250px]'
          )}
        >
          {assistants.map((assistant) => {
            const model = getModelByKey(assistant.baseModel);
            return (
              <DropdownMenuItem
                className={cn(
                  'font-medium text-xs md:text-sm',
                  activeAssistant?.assistant.key === assistant.key &&
                    'bg-zinc-50 dark:bg-black/30'
                )}
                key={assistant.key}
                onClick={() => {
                  setSelectedModel(assistant.key);
                  setIsOpen(false);
                }}
              >
                {model?.icon('sm')} {assistant.name}{' '}
                {model?.isNew && <Badge>New</Badge>}
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
