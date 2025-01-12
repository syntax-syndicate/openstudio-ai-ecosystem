import { AIMessage } from '@/app/(authenticated)/chat/components/messages/ai/ai-message';
import { HumanMessage } from '@/app/(authenticated)/chat/components/messages/human-message';
import { useChatContext } from '@/context';
import type { TChatMessage } from '@/types';
import { useMemo } from 'react';

export const PreviousMessages = () => {
  const { store } = useChatContext();
  const messages = store((state) => state.messages);
  const renderMessage = (message: TChatMessage, index: number) => {
    const isLast = (messages?.length || 0) - 1 === index;
    return (
      <div className="flex w-full flex-col items-end gap-1" key={message.id}>
        <HumanMessage chatMessage={message} isLast={isLast} />
        <AIMessage message={message} isLast={isLast} />
      </div>
    );
  };
  const previousMessages = useMemo(() => {
    return messages?.map(renderMessage);
  }, [messages]);
  return previousMessages;
};
