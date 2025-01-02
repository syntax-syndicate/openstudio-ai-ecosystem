import { ModelInfo } from '@/app/(authenticated)/chat/components/model-info';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import {
  defaultPreferences,
  usePreferences,
} from '@/app/hooks/use-preferences';
import { GearSix } from '@phosphor-icons/react';
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
import { useEffect, useState } from 'react';

export const ModelSelect = () => {
  const [selectedModel, setSelectedModel] = useState<TModelKey>('gpt-4-turbo');
  const [isOpen, setIsOpen] = useState(false);
  const { getPreferences, setPreferences } = usePreferences();
  const { getModelByKey, models } = useModelList();

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedModel(preferences.defaultModel);
    });
  }, []);

  const activeModel = getModelByKey(selectedModel);

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 pr-3 pl-1 text-xs" size="sm">
            {activeModel?.icon()} {activeModel?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          sideOffset={4}
          className="no-scrollbar max-h-[260px] min-w-[250px] overflow-y-auto text-sm"
        >
          {models.map((model) => (
            <DropdownMenuSub key={model.key}>
              <DropdownMenuSubTrigger asChild>
                <DropdownMenuItem
                  className={cn(
                    'font-medium text-sm',
                    activeModel?.key === model.key &&
                      'bg-zinc-50 dark:bg-black/30'
                  )}
                  key={model.key}
                  onClick={() => {
                    setPreferences({
                      defaultModel: model.key,
                      maxTokens: defaultPreferences.maxTokens,
                    }).then(() => {
                      setSelectedModel(model.key);
                      setIsOpen(false);
                    });
                  }}
                >
                  {model.icon()} {model.name}{' '}
                  {model.isNew && <Badge>New</Badge>}
                </DropdownMenuItem>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="dark flex min-w-[280px] flex-col gap-3 rounded-2xl bg-zinc-800 p-4 text-sm tracking-[0.1px]">
                  <ModelInfo model={model} />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem key={'manage'} onClick={() => {}}>
            <div className="flex w-6 flex-row justify-center">
              <GearSix size={16} weight="bold" />
            </div>
            Manage Models
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
