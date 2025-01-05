import { AIMessage } from '@/app/(authenticated)/chat/components/messages/ai-message';
import { HumanMessage } from '@/app/(authenticated)/chat/components/messages/human-message';
import { useSessionsContext } from '@/app/context/sessions';
import type { TChatMessage } from '@/app/hooks';
import { useEffect, useRef } from 'react';

export type TMessageListByDate = Record<string, TChatMessage[]>;
export const ChatMessages = () => {
  const { currentSession } = useSessionsContext();
  const chatContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);
  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };
  const renderMessage = (message: TChatMessage, isLast: boolean) => {
    return (
      <div className="flex w-full flex-col items-end gap-1" key={message.id}>
        <HumanMessage chatMessage={message} isLast={isLast} />
        <AIMessage chatMessage={message} isLast={isLast} />
      </div>
    );
  };
  return (
    <div
      className="no-scrollbar flex h-[100dvh] w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
      id="chat-container"
    >
      <div className="flex w-full flex-1 flex-col gap-24 p-2 md:w-[700px] lg:w-[720px]">
        <div className="flex w-full flex-col items-start gap-8">
          {currentSession?.messages?.map((message, index) =>
            renderMessage(
              message,
              currentSession?.messages.length - 1 === index
            )
          )}
        </div>
      </div>
    </div>
  );
};
