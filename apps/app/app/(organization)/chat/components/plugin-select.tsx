import { usePreferenceContext } from '@/context/preferences';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { useTools } from '@/hooks/use-tools';
import type { ToolKey } from '@/types';
import { HugeiconsIcon } from '@hugeicons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { BetaTag } from '@repo/design-system/components/ui/beta-tag';
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
  const { preferences, updatePreferences, apiKeys } = usePreferenceContext();

  const availableTools = tools.filter((tool) => tool.isVisibleInMenu);
  const availableToolKeys = availableTools.map((tool) => tool.key);

  const [selectedPlugins, setSelectedPlugins] = useState<ToolKey[]>([]);

  useEffect(() => {
    setSelectedPlugins(
      preferences.defaultPlugins?.filter((p) =>
        availableToolKeys.includes(p)
      ) || []
    );
  }, [isOpen, preferences.defaultPlugins]);

  const assistantProps = getAssistantByKey(selectedAssistantKey);

  if (!assistantProps?.model?.plugins?.length) {
    return null;
  }

  const handlePluginToggle = async (
    tool: (typeof availableTools)[0],
    checked: boolean
  ) => {
    const defaultPlugins = preferences.defaultPlugins || [];
    const isAvailable = await tool.validateAvailability?.({
      preferences,
      apiKeys,
    });

    if (checked) {
      if (!tool.validateAvailability || isAvailable) {
        updatePreferences({ defaultPlugins: [...defaultPlugins, tool.key] });
        setSelectedPlugins([...selectedPlugins, tool.key]);
      } else {
        tool.onValidationFailed?.();
      }
    } else {
      const updatedPlugins = defaultPlugins.filter(
        (plugin) => plugin !== tool.key
      );
      updatePreferences({ defaultPlugins: updatedPlugins });
      setSelectedPlugins(updatedPlugins);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content="Plugins">
        <PopoverTrigger asChild>
          <Button variant="bordered" size="sm">
            <HugeiconsIcon icon={PuzzleIcon} size={16} strokeWidth={2} />
            <Badge>{selectedPlugins.length}</Badge>
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent
        className="z-[9999] mr-8 w-[320px] rounded-xl p-0 dark:bg-zinc-700"
        side="bottom"
        align="start"
      >
        <Type
          size="sm"
          weight="medium"
          className="items-center gap-2 border-zinc-500/10 border-b px-3 py-2"
        >
          Plugins <BetaTag />
        </Type>
        <div className="no-scrollbar flex max-h-[310px] flex-col overflow-y-auto p-1.5">
          {availableTools.map((tool) => (
            <ToolItem
              key={tool.key}
              tool={tool}
              isSelected={selectedPlugins.includes(tool.key)}
              onToggle={(checked) => handlePluginToggle(tool, checked)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

type ToolItemProps = {
  tool: ReturnType<typeof useTools>['tools'][0];
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
};

const ToolItem: FC<ToolItemProps> = ({ tool, isSelected, onToggle }) => {
  const Icon = tool.icon;
  return (
    <div className="flex w-full flex-row items-center gap-3 rounded-lg px-3 py-2 text-xs hover:bg-zinc-50 md:text-sm dark:hover:bg-black/30">
      <Flex
        items="center"
        justify="center"
        className="h-8 w-8 rounded-lg border border-zinc-500/15 bg-white dark:bg-zinc-700"
      >
        <HugeiconsIcon
          icon={Icon}
          size={16}
          strokeWidth={2}
          className="flex-shrink-0"
        />
      </Flex>{' '}
      <Flex direction="col" gap="none" items="start">
        <Type size="sm" weight="medium">
          {tool.displayName}
        </Type>
        <Type size="xs" textColor="tertiary">
          {tool.description}
        </Type>
      </Flex>
      <span className="flex-1" />
      <Switch checked={isSelected} onCheckedChange={onToggle} />
    </div>
  );
};
