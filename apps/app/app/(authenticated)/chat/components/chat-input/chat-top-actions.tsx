import { AssistantModal } from '@/app/(authenticated)/chat/components/assistants/assistant-modal';
import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { defaultPreferences } from '@/config/preferences';
import { usePreferenceContext } from '@/context/preferences';
import { useRootContext } from '@/context/root';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TAssistant } from '@/types/assistants';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { ChevronLeft, ChevronRight, Github } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ChatTopActions = () => {
  const { setOpen, renderModal } = useFeedback();
  const { preferences, updatePreferences } = usePreferenceContext();
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<
    TAssistant['key']
  >(preferences.defaultAssistant);
  const { models, getAssistantByKey } = useAssistantUtils();
  const { isSidebarOpen, setIsSidebarOpen } = useRootContext();
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

  return (
    <Flex
      className="w-full px-1 pt-2 pb-2 md:p-2.5"
      items="center"
      justify="between"
    >
      <Flex gap="xs" items="center">
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ChevronLeft size={16} strokeWidth={2} />
          ) : (
            <ChevronRight size={16} strokeWidth={2} />
          )}
        </Button>
        <AssistantModal
          selectedAssistantKey={selectedAssistantKey}
          onAssistantchange={setSelectedAssistantKey}
        />
        <PluginSelect selectedAssistantKey={selectedAssistantKey} />
      </Flex>
      <Flex gap="xs" items="center">
        <Button
          variant="bordered"
          size="sm"
          onClick={() => {
            window.open(
              'https://github.com/kuluruvineeth/openstudio-beta',
              '_blank'
            );
          }}
        >
          <Github size={16} />
          Star on Github
        </Button>
        <Button
          variant="bordered"
          size="sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          Feedback
        </Button>
      </Flex>
      {renderModal()}
    </Flex>
  );
};
