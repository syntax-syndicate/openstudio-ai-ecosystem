import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { CheckCircle } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@repo/design-system/components/ui/sheet-vaul';
import { cn } from '@repo/design-system/lib/utils';
import { useEffect, useState } from 'react';

export const ModelSelect = () => {
  const [selectedModel, setSelectedModel] = useState<TModelKey>('gpt-4-turbo');

  const { getPreferences, setPreferences } = usePreferences();
  const { getModelByKey, models } = useModelList();

  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedModel(preferences.defaultModel);
    });
  }, []);

  const activeModel = getModelByKey(selectedModel);

  return (
    <Sheet>
      <SheetTrigger>
        <Button
          variant="secondary"
          className="gap-1 pr-3 pl-1 text-xs"
          size="sm"
        >
          {activeModel?.icon()} {activeModel?.name}
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0 overflow-hidden">
        <div className="max-h-[320px] overflow-y-auto p-2">
          {models.map((model) => (
            <div
              className={cn(
                'flex cursor-pointer flex-row items-center justify-between gap-2 rounded-2xl p-3 text-sm hover:bg-white/5',
                activeModel?.key === model.key && 'bg-white/5'
              )}
              key={model.key}
              onClick={() => {
                setPreferences({ defaultModel: model.key }).then(() => {
                  setSelectedModel(model.key);
                });
              }}
            >
              <div className="flex flex-row items-center gap-3">
                {' '}
                {model.icon()} {model.name} {model.isNew && <Badge>New</Badge>}
              </div>
              <div className="flex flex-row items-center gap-3">
                {activeModel?.key === model.key && (
                  <CheckCircle size={24} weight="fill" />
                )}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
