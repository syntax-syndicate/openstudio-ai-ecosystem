import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { type TToolKey, useTools } from '@/app/hooks/use-tools';
import { Plug } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useEffect, useState } from 'react';

export type TPluginSelect = {
  selectedModel: TModelKey;
};
export const PluginSelect = ({ selectedModel }: TPluginSelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const { tools } = useTools();
  const { getModelByKey } = useModelList();
  const { setPreferences, getPreferences } = usePreferences();
  const [selectedPlugins, setSelectedPlugins] = useState<TToolKey[]>([]);
  useEffect(() => {
    getPreferences().then((preferences) => {
      setSelectedPlugins(preferences.defaultPlugins || []);
    });
  }, [isOpen]);
  const model = getModelByKey(selectedModel);
  if (!model?.plugins?.length) {
    return null;
  }
  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip content="Plugins">
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plug size={16} weight="bold" />
              {!!selectedPlugins?.length && (
                <Badge>{selectedPlugins.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
        </Tooltip>
        <PopoverContent
          className="roundex-2xl mr-8 w-[300px] p-0 dark:bg-zinc-700"
          side="top"
        >
          <p className="flex flex-row gap-2 border-zinc-500/20 border-b px-3 py-2 font-medium text-sm">
            Plugins <Badge>Beta</Badge>
          </p>
          <div className="flex flex-col p-1">
            {tools.map((tool) => (
              <div
                key={tool.key}
                className="flex w-full flex-row gap-2 rounded-2xl p-2 text-xs hover:bg-zinc-50 md:text-sm dark:hover:bg-black/30"
              >
                {tool.icon('md')} {tool.name} <span className="flex-1" />
                <Switch
                  checked={selectedPlugins.includes(tool.key)}
                  onCheckedChange={(checked) => {
                    getPreferences().then((preferences) => {
                      const defaultPlugins = preferences.defaultPlugins || [];
                      if (checked) {
                        setPreferences({
                          defaultPlugins: [...defaultPlugins, tool.key],
                        });
                        setSelectedPlugins([...selectedPlugins, tool.key]);
                      } else {
                        setPreferences({
                          defaultPlugins: defaultPlugins.filter(
                            (plugin) => plugin !== tool.key
                          ),
                        });
                        setSelectedPlugins(
                          selectedPlugins.filter(
                            (plugin) => plugin !== tool.key
                          )
                        );
                      }
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
