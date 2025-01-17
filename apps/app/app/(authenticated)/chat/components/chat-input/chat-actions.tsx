import { ImageUpload } from '@/app/(authenticated)/chat/components/chat-input/image-upload';
import { SpaceSelector } from '@/app/(authenticated)/chat/components/chat-input/space-selector';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { defaultPreferences } from '@/config';
import {
  useAssistants,
  useChatContext,
  usePreferenceContext,
  usePromptsContext,
} from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TAssistant } from '@/types';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import { ArrowUp, Book, ChevronDown } from 'lucide-react';
import { CircleStop } from 'lucide-react';
import { useEffect, useState } from 'react';

export type TChatActions = {
  sendMessage: (message: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const ChatActions = ({
  sendMessage,
  handleImageUpload,
}: TChatActions) => {
  const { store } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);
  const editor = store((state) => state.editor);
  const { preferences, updatePreferences } = usePreferenceContext();
  const { selectedAssistant, open: openAssistants } = useAssistants();
  const { open: openPrompts } = usePromptsContext();
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<
    TAssistant['key']
  >(preferences.defaultAssistant);
  const { models, getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  const stopGeneration = store((state) => state.stopGeneration);
  const currentMessage = store((state) => state.currentMessage);
  useEffect(() => {
    const assistantProps = getAssistantByKey(preferences.defaultAssistant);
    if (assistantProps?.model) {
      setSelectedAssistantKey(preferences.defaultAssistant);
    } else {
      updatePreferences({
        defaultAssistant: defaultPreferences.defaultAssistant,
      });
    }
  }, [models, preferences.defaultAssistant]);
  const assistantKey = selectedAssistant?.assistant.key;
  const assistantName = selectedAssistant?.assistant.name;
  const hasTextInput = !!editor?.getText();
  const sendButtonClasses = cn({
    '!bg-teal-600/20 text-teal-600 dark:text-teal-400': hasTextInput,
  });
  return (
    <Flex
      className="w-full px-1 pt-1 pb-1 md:px-2 md:pb-2"
      items="center"
      justify="between"
    >
      <Flex gap="xs" items="center">
        <Button
          variant="secondary"
          onClick={openAssistants}
          className="gap-1 pr-3 pl-1.5"
          size="sm"
        >
          {assistantKey && getAssistantIcon(assistantKey, 'sm')}
          {assistantName}
          <ChevronDown size={16} strokeWidth={2} />
        </Button>
        <PluginSelect selectedAssistantKey={selectedAssistantKey} />
        <ImageUpload
          id="image-upload"
          label="Upload Image"
          tooltip="Upload Image"
          showIcon
          handleImageUpload={handleImageUpload}
        />
        <SpaceSelector />
      </Flex>
      <Flex gap="xs" items="center">
        <Tooltip content="Prompts">
          <Button
            size="iconSm"
            variant="ghost"
            onClick={() => {
              openPrompts();
            }}
          >
            <Book size={16} strokeWidth="2" />
          </Button>
        </Tooltip>
        {isGenerating ? (
          <Button size="sm" variant="secondary" onClick={stopGeneration}>
            <CircleStop size={16} strokeWidth={2} /> Stop
          </Button>
        ) : (
          <Button
            size="sm"
            variant={hasTextInput ? 'default' : 'secondary'}
            disabled={!hasTextInput || isGenerating}
            onClick={() => {
              editor?.getText() && sendMessage(editor?.getText());
            }}
          >
            <ArrowUp size={16} strokeWidth="2" /> Send
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
