import { PreviousMessages } from '@/app/(organization)/chat/components/messages/previous-messages';
import { RecentMessage } from '@/app/(organization)/chat/components/messages/recent-message';
import { WelcomeMessage } from '@/app/(organization)/chat/components/welcome-message';
import { useState, useEffect } from 'react';
import { ChatTopNav } from '@/app/(organization)/chat/components/chat-input/chat-top-nav';
import { Button } from '@repo/design-system/components/ui';
import { ArrowDown02Icon } from '@hugeicons/react';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { usePreferenceContext } from '@/context/preferences';


export const ChatMessages = () => {
  const {preferences} = usePreferenceContext();
  const {getAssistantIcon} = useAssistantUtils();
  const [showScrollButtons, setShowScrollButtons] = useState<{[key: string]: boolean}>({});

  const MIN_COLUMN_WIDTH = Math.max(
    300,
    Math.min(400, window.innerWidth * 0.8)
  );

  const models = preferences.defaultAssistants!
  
  const gridCols = models.length;
  const minTotalWidth = MIN_COLUMN_WIDTH * gridCols;

  const scrollToBottom = () => {
    const containers = document.querySelectorAll('.column-scroll-container');
    containers.forEach(container => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    });
  };

  useEffect(() => {
    const handleScroll = (container: Element, modelId: string) => {
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      setShowScrollButtons(prev => ({
        ...prev,
        [modelId]: !isAtBottom
      }));
    };

    const containers = document.querySelectorAll('.column-scroll-container');
    containers.forEach((container, index) => {
      const modelId = models[index];
      container.addEventListener('scroll', () => handleScroll(container, modelId));
      // Initial check
      handleScroll(container, modelId);
    });

    return () => {
      containers.forEach((container, index) => {
        const modelId = models[index];
        container.removeEventListener('scroll', () => handleScroll(container, modelId));
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
          <PreviousMessages/>
          <RecentMessage/>
        </div>
      </div>
    );
  }

return (
    <div className="flex h-[100dvh] w-full flex-col items-center" id="chat-container">
      <div 
        className="h-full w-full overflow-y-auto pb-[200px]"
      >
        <div 
          className="flex h-full overflow-x-auto no-scrollbar"
          style={{
            width: `100%`,
            minWidth: `${minTotalWidth}px`,
          }}
        >
          {models.map((modelId) => (
            <div
              key={modelId}
              className="flex-1 min-w-0 h-full border-r last:border-r-0 relative"
              style={{ 
                width: `${100 / gridCols}%`,
                minWidth: `${MIN_COLUMN_WIDTH}px`
              }}
            >
              <div className="h-full overflow-y-auto no-scrollbar column-scroll-container">
                <div className="sticky top-0 bg-white/80 dark:bg-zinc-800 backdrop-blur-sm p-2 mb-4 rounded shadow-sm z-[999]">
                  <div className="flex items-center justify-center gap-2">
                      {getAssistantIcon(modelId, 'sm', true)}
                    <h3 className="font-medium text-center">{modelId}</h3>
                  </div>
                </div>
                <div className="px-4">
                  <WelcomeMessage />
                  <PreviousMessages />
                  <RecentMessage />
                </div>
              </div>
              {models.length > 1 && showScrollButtons[modelId] && (
                <Button
                  variant="bordered"
                  size="icon-xs"
                  rounded="full"
                  onClick={() => {
                    const container = document.querySelectorAll('.column-scroll-container')[models.indexOf(modelId)];
                    container?.scrollTo({
                      top: container.scrollHeight,
                      behavior: 'smooth'
                    });
                  }}
                  className="absolute bottom-4 inset-x-0 mx-auto w-fit  rounded-full p-3 shadow-lg transition-colors z-[1000]"
                  aria-label={`Scroll ${modelId} to bottom`}
                >
                  <ArrowDown02Icon size={16} strokeWidth="2" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
   
  );
};
