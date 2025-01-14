import { usePreferenceContext } from '@/context/preferences';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { useTools } from '@/hooks/use-tools';
import type { TToolKey } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { PuzzleIcon } from '@repo/design-system/components/ui/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { type FC, useEffect, useState } from 'react';

export type TPluginSelect = {
  selectedAssistantKey: string;
};

export const PluginSelect: FC<TPluginSelect> = ({ selectedAssistantKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { tools } = useTools();
  const { getAssistantByKey } = useAssistantUtils();
  const { preferences, updatePreferences } = usePreferenceContext();
  const availableTools = tools.filter((tool) => tool.showInMenu);
  const availableToolsKey = availableTools.map((tool) => tool.key);
  const [selectedPlugins, setSelectedPlugins] = useState<TToolKey[]>([]);
  useEffect(() => {
    setSelectedPlugins(
      preferences.defaultPlugins?.filter((p) =>
        availableToolsKey.includes(p)
      ) || []
    );
  }, [isOpen, preferences]);

  const assistantProps = getAssistantByKey(selectedAssistantKey);

  if (!assistantProps?.model?.plugins?.length) {
    return null;
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip content="Plugins">
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <PuzzleIcon size={18} variant="stroke" strokeWidth="2" />
              <Badge>{selectedPlugins.length}</Badge>
            </Button>
          </PopoverTrigger>
        </Tooltip>
        <PopoverContent
          className="roundex-lg mr-8 w-[340px] p-0 dark:bg-zinc-700"
          side="top"
        >
          <Type
            size="sm"
            weight="medium"
            className="border-zinc-500/20 border-b px-3 py-2 gap-2"
          >
            Plugins <Badge>Beta</Badge>
          </Type>
          <div className="flex flex-col p-1">
            {availableTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.key}
                  className="flex w-full flex-row items-center gap-3 rounded-lg px-3 py-2 text-xs hover:bg-zinc-50 md:text-sm dark:hover:bg-black/30"
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <Flex direction="col" gap="none" items="start">
                    <Type size="sm" weight="medium">
                      {tool.name}
                    </Type>
                    <Type size="xs" textColor="tertiary">
                      {tool.description}
                    </Type>
                  </Flex>
                  <span className="flex-1" />
                  <Switch
                    checked={selectedPlugins.includes(tool.key)}
                    onCheckedChange={async (checked) => {
                      const defaultPlugins = preferences.defaultPlugins || [];
                      const isValidated = await tool?.validate?.();

                      if (checked) {
                        if (tool?.validate === undefined || isValidated) {
                          updatePreferences({
                            defaultPlugins: [...defaultPlugins, tool.key],
                          });
                          setSelectedPlugins([...selectedPlugins, tool.key]);
                        } else {
                          tool?.validationFailedAction?.();
                        }
                      } else {
                        updatePreferences({
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
                    }}
                  />
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
