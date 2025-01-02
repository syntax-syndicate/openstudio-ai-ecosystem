import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
          <Button variant="ghost" className="gap-1 pr-3 pl-1 text-xs" size="sm">
            {activeModel?.icon()} {activeModel?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[250px] text-sm">
          {models.map((model) => (
            <DropdownMenuItem
              className={cn(
                activeModel?.key === model.key && 'bg-zinc-200 dark:bg-zinc-800'
              )}
              key={model.key}
              onClick={() => {
                setPreferences({ defaultModel: model.key }).then(() => {
                  setSelectedModel(model.key);
                  setIsOpen(false);
                });
              }}
            >
              {model.icon()} {model.name} {model.isNew && <Badge>New</Badge>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
