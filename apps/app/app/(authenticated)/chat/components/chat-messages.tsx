import { useChatContext } from '@/app/context/chat/context';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { Avatar } from '@repo/design-system/components/ui/custom-avatar';
import { useEffect, useRef } from 'react';

export const ChatMessages = () => {
  const { renderMarkdown } = useMarkdown();
  const { lastStream, currentSession, error } = useChatContext();
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (lastStream) {
      scrollToBottom();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === currentSession?.id;

  const renderMessage = (
    key: string,
    humanMessage: string,
    aiMessage: string
  ) => {
    return (
      <div className="flex w-full flex-col items-start gap-1" key={key}>
        <div className="flex flex-row gap-2 rounded-2xl border border-white/5 bg-black/30 p-2 pr-4 text-sm">
          <Avatar name="Vineeth" />
          <span className="pt-1 leading-5">{humanMessage}</span>
        </div>
        <div className="w-full rounded-2xl border border-white/5 bg-white/5 p-4">
          {renderMarkdown(aiMessage)}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex h-screen w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
    >
      <div className="flex w-[600px] flex-col gap-8">
        {currentSession?.messages.map((message) =>
          renderMessage(message.id, message.rawHuman, message.rawAI)
        )}
        {isLastStreamBelongsToCurrentSession &&
          lastStream?.props?.query &&
          renderMessage('last', lastStream?.props?.query, lastStream?.message)}
        {error && (
          <div className="text-red-500">
            {renderMessage('error', 'Ahh!', error)}
          </div>
        )}
      </div>
    </div>
  );
};
