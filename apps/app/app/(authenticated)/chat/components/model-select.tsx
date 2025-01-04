import { ModelInfo } from '@/app/(authenticated)/chat/components/model-info';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { defaultPreferences } from '@/app/hooks/use-preferences';

import { usePreferenceContext } from '@/app/context/preferences/provider';
import { DropdownMenuSubTrigger } from '@radix-ui/react-dropdown-menu';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
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
  const { preferences, updatePreferences } = usePreferenceContext();
  const { getModelByKey, models } = useModelList();

  const activeModel = getModelByKey(selectedModel);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant || 'ghost'}
            className={cn('gap-2 pr-3 pl-1 text-xs md:text-sm', className)}
            size="sm"
          >
            {activeModel?.icon()} {activeModel?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="start"
          sideOffset={4}
          className={cn(
            'no-scrollbar max-h-[260px] overflow-y-auto text-xs md:text-sm',
            fullWidth ? 'w-full' : 'min-w-[250px]'
          )}
        >
          {models.map((model) => (
            <DropdownMenuSub key={model.key}>
              <DropdownMenuSubTrigger asChild>
                <DropdownMenuItem
                  className={cn(
                    'font-medium text-xs md:text-sm',
                    activeModel?.key === model.key &&
                      'bg-zinc-50 dark:bg-black/30'
                  )}
                  key={model.key}
                  onClick={() => {
                    updatePreferences(
                      {
                        defaultModel: model.key,
                        maxTokens: defaultPreferences.maxTokens,
                      },
                      () => {
                        setSelectedModel(model.key);
                        setIsOpen(false);
                      }
                    );
                  }}
                >
                  {model.icon()} {model.name}{' '}
                  {model.isNew && <Badge>New</Badge>}
                </DropdownMenuItem>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="dark flex min-w-[280px] flex-col gap-3 rounded-2xl bg-zinc-800 p-4 text-sm tracking-[0.1px] md:text-base">
                  <ModelInfo model={model} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
