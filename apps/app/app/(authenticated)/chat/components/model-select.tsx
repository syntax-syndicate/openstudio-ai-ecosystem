import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { Button } from '@repo/design-system/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="pr-4 pl-2">
          {activeModel?.icon()} {activeModel?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 mr-2 w-56">
        {models.map((model) => (
          <DropdownMenuItem
            onClick={() => {
              setPreferences({ defaultModel: model.key }).then(() => {
                setSelectedModel(model.key);
              });
            }}
          >
            {model.icon()} {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
