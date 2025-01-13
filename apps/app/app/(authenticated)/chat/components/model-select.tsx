import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TModelKey } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import {
  Button,
  type ButtonProps,
} from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { cn } from '@repo/design-system/lib/utils';
import { type FC, useState } from 'react';

export type TModelSelect = {
  selectedModel: TModelKey;
  fullWidth?: boolean;
  variant?: ButtonProps['variant'];
  setSelectedModel: (model: TModelKey) => void;
  className?: string;
};

export const ModelSelect: FC<TModelSelect> = ({
  selectedModel,
  variant,
  fullWidth,
  setSelectedModel,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    getModelByKey,
    models,
    assistants,
    getAssistantByKey,
    getAssistantIcon,
  } = useAssistantUtils();

  const activeAssistant = getAssistantByKey(selectedModel);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || 'ghost'}
            className={cn('gap-2 text-xs md:text-sm', className)}
            size="sm"
          >
            {activeAssistant?.assistant &&
              getAssistantIcon(activeAssistant?.assistant.key, 'sm')}
            {activeAssistant?.assistant?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={4}
          className={cn(
            'no-scrollbar z-[610] max-h-[260px] overflow-y-auto text-xs md:text-sm',
            fullWidth ? 'w-full' : 'min-w-[250px]'
          )}
        >
          {assistants
            ?.filter((a) => a.type === 'base')
            .map((assistant) => {
              const model = getModelByKey(
                assistant.baseModel,
                assistant.provider
              );

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
                  {getAssistantIcon(assistant.key, 'sm')}
                  {assistant.name}
                  {model?.isNew && <Badge>New</Badge>}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
