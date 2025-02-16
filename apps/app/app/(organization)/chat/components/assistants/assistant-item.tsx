import { defaultPreferences } from '@/config';
import { usePreferenceContext } from '@/context';
import { formatNumber } from '@/helper/utils';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TAssistant } from '@/types';
import { Badge } from '@repo/design-system/components/ui/badge';
import { CommandItem } from '@repo/design-system/components/ui/command';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { Eye, ToyBrick } from 'lucide-react';

export type TAssistantItem = {
  assistant: TAssistant;
  onSelect: (assistant: TAssistant) => void;
};

export const AssistantItem = ({ assistant, onSelect }: TAssistantItem) => {
  const { updatePreferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const assistantProps = getAssistantByKey(assistant.key);
  const model = assistantProps?.model;

  const handleSelect = () => {
    updatePreferences(
      {
        defaultAssistant: assistant.key,
        maxTokens: defaultPreferences.maxTokens,
      },
      () => onSelect(assistant)
    );
  };

  return (
    <CommandItem
      value={assistant.name}
      className="!py-2.5 w-full"
      onSelect={handleSelect}
    >
      <Flex gap="md" items="center" key={assistant.key} className="w-full">
        <Flex direction="col">
          <Flex gap="sm" items="center" className="flex-1">
            <Type size="sm" weight="medium">
              {assistant.name}
            </Type>
            {model?.isNew && assistant.type !== 'custom' && <Badge>New</Badge>}
          </Flex>
        </Flex>
        <div className="flex flex-1"></div>

        <Flex gap="md" items="center">
          {!!model?.vision && (
            <Eye size={16} strokeWidth={1.5} className="text-zinc-500" />
          )}
          {!!model?.plugins?.length && (
            <ToyBrick size={16} strokeWidth={1.5} className="text-zinc-500" />
          )}
          {model?.tokens && (
            <Type size="xs" textColor="secondary">
              {formatNumber(model?.tokens)}
            </Type>
          )}
        </Flex>
      </Flex>
    </CommandItem>
  );
};
