import { PreviousMessages } from '@/app/(organization)/chat/components/messages/previous-messages';
import { RecentMessage } from '@/app/(organization)/chat/components/messages/recent-message';
import { WelcomeMessage } from '@/app/(organization)/chat/components/welcome-message';
import { useChatContext } from '@/context';
import { usePreferenceContext } from '@/context/preferences';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { usePremium } from '@/hooks/use-premium';
import { ArrowDown02Icon } from '@hugeicons/react';
import { LabsIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { useEffect, useState } from 'react';

export const ChatMessages = () => {
  const { preferences, updatePreferences } = usePreferenceContext();
  const { getAssistantIcon } = useAssistantUtils();
  const [showScrollButtons, setShowScrollButtons] = useState<{
    [key: string]: boolean;
  }>({});
  const { store } = useChatContext();
  const messages = store((state) => state.messages);
  const currentMessage = store((state) => state.currentMessage);

  const isInitialized = store((state) => state.isInitialized);
  const session = store((state) => state.session);
  const { isPremium } = usePremium();

  // useEffect(() => {
  //   // Only update preferences for existing sessions (not fresh ones)
  //   if (isInitialized && session && messages.length > 0) {
  //     // Get all unique assistant keys from the conversation history
  //     const historicalAssistants = Array.from(new Set(
  //       messages.flatMap(msg =>
  //         (msg.aiResponses || []).map(response => response.assistant.key)
  //       )
  //     ));

  //     // Update preferences to match historical assistants
  //     if (historicalAssistants.length > 0) {
  //       updatePreferences({
  //         ...preferences,
  //         defaultAssistants: historicalAssistants,
  //         defaultAssistant: historicalAssistants[0],
  //       });
  //     }
  //   }
  // }, [isInitialized, session?.id, messages]);

  useEffect(() => {
    // Only update preferences for existing sessions (not fresh ones)
    if (isInitialized && session && messages.length > 0) {
      // Get all unique assistant keys from the conversation history
      const historicalAssistants = Array.from(
        new Set(
          messages.flatMap((msg) =>
            (msg.aiResponses || []).map((response) => response.assistant.key)
          )
        )
      );

      // Get current preferences
      const currentPreferences = preferences.defaultAssistants || [];

      // Determine max allowed models based on user's plan
      const MAX_MODELS = isPremium ? 2 : 2;

      // Combine and limit the assistants, prioritizing current preferences
      const combinedAssistants = Array.from(
        new Set([...currentPreferences, ...historicalAssistants])
      ).slice(0, MAX_MODELS);

      // Update preferences only if the combined list is different
      if (
        combinedAssistants.length > 0 &&
        JSON.stringify(combinedAssistants) !==
          JSON.stringify(preferences.defaultAssistants)
      ) {
        updatePreferences({
          ...preferences,
          defaultAssistants: combinedAssistants,
          defaultAssistant: combinedAssistants[0],
        });
      }
    }
  }, [isInitialized, session?.id, messages, preferences.defaultAssistants]);

  const MIN_COLUMN_WIDTH = Math.max(
    300,
    Math.min(400, window.innerWidth * 0.8)
  );

  // const models =  preferences.defaultAssistants!;

  // Combine historical assistants with current preferences
  const models = preferences.defaultAssistants!;

  const gridCols = models.length;
  const minTotalWidth = MIN_COLUMN_WIDTH * gridCols;

  const scrollToBottom = () => {
    const containers = document.querySelectorAll('.column-scroll-container');
    containers.forEach((container) => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    });
  };

  useEffect(() => {
    const handleScroll = (container: Element, modelId: string) => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;
      setShowScrollButtons((prev) => ({
        ...prev,
        [modelId]: !isAtBottom,
      }));
    };

    const containers = document.querySelectorAll('.column-scroll-container');
    containers.forEach((container, index) => {
      const modelId = models[index];
      container.addEventListener('scroll', () =>
        handleScroll(container, modelId)
      );
      // Initial check
      handleScroll(container, modelId);
    });

    return () => {
      containers.forEach((container, index) => {
        const modelId = models[index];
        container.removeEventListener('scroll', () =>
          handleScroll(container, modelId)
        );
      });
    };
  }, [models]);

  // If only one model, use the original single-column layout
  if (models.length === 1) {
    return (
      <div
        className="flex h-[100dvh] w-full flex-col items-center overflow-y-auto pb-[200px]"
        id="chat-container"
      >
        <div className="flex w-full translate-x-0 flex-col items-start px-4 pt-4 md:w-[620px] lg:w-[680px]">
          <WelcomeMessage />
          <PreviousMessages />
          <RecentMessage />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-[100dvh] w-full flex-col items-center"
      id="chat-container"
    >
      {models.length > 1 && (
        <div className="w-full border-yellow-200 border-b bg-yellow-500/50 dark:border-yellow-800/50 dark:bg-yellow-900/20">
          <Flex
            items="center"
            gap="xs"
            justify="center"
            className="px-4 py-2 text-yellow-800 dark:text-yellow-200"
          >
            <LabsIcon className="h-4 w-4" />
            <Type size="sm" weight="medium">
              ChatHub Labs - Experimental Multi-Assistant Mode, Please expect
              bugs and issues.
            </Type>
          </Flex>
        </div>
      )}
      <div className="h-full w-full overflow-y-auto pb-[200px]">
        <div
          className="no-scrollbar flex h-full overflow-x-auto"
          style={{
            width: `100%`,
            minWidth: `${minTotalWidth}px`,
          }}
        >
          {models.map((modelId) => {
            const assistantResponse = currentMessage?.aiResponses?.find(
              (r) => r.assistant.key === modelId
            );

            return (
              <div
                key={modelId}
                data-model-id={modelId}
                className="relative h-full min-w-0 flex-1 border-r last:border-r-0"
                style={{
                  width: `${100 / gridCols}%`,
                  minWidth: `${MIN_COLUMN_WIDTH}px`,
                }}
              >
                <div className="no-scrollbar column-scroll-container h-full overflow-y-auto">
                  <div className="sticky top-0 z-50 mb-4 rounded bg-white/80 p-2 shadow-sm backdrop-blur-sm dark:bg-zinc-800">
                    <div className="flex items-center justify-center gap-2">
                      {getAssistantIcon(modelId, 'sm', true)}
                      <h3 className="text-center font-medium">{modelId}</h3>
                    </div>
                  </div>
                  <div className="px-4">
                    {/* <>Test: {assistantResponse?.rawAI}</> */}
                    <WelcomeMessage />
                    <PreviousMessages assistantKey={modelId} />
                    <RecentMessage assistantKey={modelId} />
                  </div>
                </div>
                {models.length > 1 && showScrollButtons[modelId] && (
                  <Button
                    variant="bordered"
                    size="icon-xs"
                    rounded="full"
                    onClick={() => {
                      const container = document.querySelectorAll(
                        '.column-scroll-container'
                      )[models.indexOf(modelId)];
                      container?.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth',
                      });
                    }}
                    className="absolute inset-x-0 bottom-4 z-[1000] mx-auto w-fit rounded-full p-3 shadow-lg transition-colors"
                    aria-label={`Scroll ${modelId} to bottom`}
                  >
                    <ArrowDown02Icon size={16} strokeWidth="2" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
