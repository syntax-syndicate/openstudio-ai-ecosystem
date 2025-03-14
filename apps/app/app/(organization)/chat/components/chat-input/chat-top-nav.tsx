import { AssistantModal } from '@/app/(organization)/chat/components/assistants/assistant-modal';
import { useFeedback } from '@/app/(organization)/chat/components/feedback/use-feedback';
import { TopNav } from '@/app/(organization)/chat/components/layout/top-nav';
import { PluginSelect } from '@/app/(organization)/chat/components/plugin-select';
import { defaultPreferences } from '@/config/preferences';
import { usePreferenceContext } from '@/context/preferences';
import { useRootContext } from '@/context/root';
import { useSessions } from '@/context/sessions';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { usePremium } from '@/hooks/use-premium';
import type { TAssistant } from '@/types/assistants';
import { MoneyBag02Icon } from '@hugeicons-pro/core-stroke-rounded';
import { HugeiconsIcon } from '@hugeicons/react';
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
    setOpenPricingModal,
  } = useRootContext();
  const { createSession } = useSessions();
  const { isPremium } = usePremium();
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

      <Button
        variant="premium"
        className={`${isPremium ? '!text-green-500 bg-green-500/10 hover:bg-green-500/20' : ''}`}
        onClick={() => setOpenPricingModal(true)}
      >
        <HugeiconsIcon icon={MoneyBag02Icon} size={16} strokeWidth={2} />{' '}
        {isPremium ? 'Pro' : 'Upgrade to Pro'}
      </Button>
    </TopNav>
  );
};
