import { AssistantModal } from '@/app/(authenticated)/chat/components/assistants/assistant-modal';
import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { defaultPreferences } from '@/config/preferences';
import { usePreferenceContext } from '@/context/preferences';
import { useRootContext } from '@/context/root';
import { useSessions } from '@/context/sessions';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TAssistant } from '@/types/assistants';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FlagIcon, Github, PanelLeft, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ChatTopNav = () => {
  const { setOpen, renderModal } = useFeedback();
  const { preferences, updatePreferences } = usePreferenceContext();
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<
    TAssistant['key']
  >(preferences.defaultAssistant);
  const { models, getAssistantByKey } = useAssistantUtils();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useRootContext();
  const { createSession } = useSessions();
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
      className="absolute top-0 z-20 w-full rounded-t-md border-zinc-500/10 border-b bg-zinc-25 p-1 md:p-2 dark:bg-zinc-800"
      items="center"
      justify="between"
    >
      <Flex gap="xs" items="center">
        <Button
          variant="ghost"
          size="iconSm"
          className="flex lg:hidden"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <PanelLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="iconSm"
          className="hidden lg:flex"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <PanelLeft size={16} strokeWidth={2} />
        </Button>
        <Button
          variant="ghost"
          size="iconSm"
          className="flex lg:hidden"
          onClick={() => {
            createSession();
          }}
        >
          <Plus size={16} strokeWidth={2} />
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
          <span className="hidden md:block">Star on Github</span>
        </Button>
        <Button
          variant="bordered"
          size="sm"
          onClick={() => {
            setOpen(true);
          }}
        >
          <FlagIcon size={16} className="block md:hidden" />
          <span className="hidden md:block">Feedback</span>
        </Button>
      </Flex>
      {renderModal()}
    </Flex>
  );
};
