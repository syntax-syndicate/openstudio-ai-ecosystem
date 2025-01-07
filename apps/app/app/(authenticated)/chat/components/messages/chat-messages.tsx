import { AIMessage } from '@/app/(authenticated)/chat/components/messages/ai/ai-message';
import { HumanMessage } from '@/app/(authenticated)/chat/components/messages/human-message';
import { useChatContext } from '@/context';
import type { TChatMessage } from '@/types';
import { useEffect, useRef } from 'react';

export type TMessageListByDate = Record<string, TChatMessage[]>;

export const ChatMessages = () => {
  const { store } = useChatContext();
  const session = store((state) => state.session);
  const messages = store((state) => state.messages);
  const isGenerating = store((state) => state.isGenerating);
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isUserNearBottom()) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages?.length]);

  function isUserNearBottom() {
    var scrollThreshold = 50;
    if (chatContainer.current) {
      // Adjust this value as needed
      return (
        chatContainer.current.scrollHeight - chatContainer.current.scrollTop <=
        chatContainer.current.clientHeight + scrollThreshold
      );
    }
  }

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  const renderMessage = (message: TChatMessage, isLast: boolean) => {
    return (
      <div className="flex w-full flex-col items-end gap-1" key={message.id}>
        <HumanMessage chatMessage={message} isLast={isLast} />
        <AIMessage message={message} isLast={isLast} />
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
          {messages?.map((message, index) =>
            renderMessage(message, messages.length - 1 === index)
          )}
        </div>
      </div>
    </div>
  );
};
