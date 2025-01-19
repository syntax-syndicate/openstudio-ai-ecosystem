import { AssistantModal } from '@/app/(authenticated)/chat/components/assistants/assistant-modal';
import { useFeedback } from '@/app/(authenticated)/chat/components/feedback/use-feedback';
import { TopNav } from '@/app/(authenticated)/chat/components/layout/top-nav';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { defaultPreferences } from '@/config/preferences';
import { usePreferenceContext } from '@/context/preferences';
import { useRootContext } from '@/context/root';
import { useSessions } from '@/context/sessions';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import type { TAssistant } from '@/types/assistants';
import { Button } from '@repo/design-system/components/ui/button';
import { Plus } from 'lucide-react';
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
    <TopNav>
      <Button
        variant="ghost"
        size="icon-sm"
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
    </TopNav>
  );
};
