import { AIMessageBubble } from '@/app/(authenticated)/chat/components/ai-bubble';
import { useBots } from '@/app/context/bots/context';
import { useSessionsContext } from '@/app/context/sessions/provider';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import { Quotes } from '@phosphor-icons/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export type TMessageListByDate = Record<string, TChatMessage[]>;

export const ChatMessages = () => {
  const { currentSession, updateSessionMutation, refetchCurrentSession } =
    useSessionsContext();
  const chatContainer = useRef<HTMLDivElement>(null);
  const { open: openBot } = useBots();

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
        {message.inputProps?.context && (
          <div className="ml-16 flex flex-row gap-2 rounded-2xl border border-transparent bg-zinc-50 p-2 pr-4 pl-3 text-sm text-zinc-600 hover:border-white/5 md:ml-32 md:text-base dark:bg-black/30 dark:text-zinc-100">
            <Quotes size={16} weight="bold" className="mt-2 flex-shrink-0" />

            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {message.inputProps?.context}
            </span>
          </div>
        )}
        {message?.inputProps?.image && (
          <Image
            src={message?.inputProps?.image}
            alt="uploaded image"
            className="h-[120px] min-w-[120px] rounded-2xl border border-black/10 object-cover shadow-sm dark:border-white/10"
            width={0}
            sizes="50vw"
            height={0}
          />
        )}
        <div className="ml-16 flex flex-row gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:ml-32 md:text-base dark:bg-black/30 dark:text-zinc-100">
          <span className="whitespace-pre-wrap pt-[0.20em] pb-[0.15em] leading-6">
            {message.rawHuman}
          </span>
        </div>
        <AIMessageBubble chatMessage={message} isLast={isLast} />
      </div>
    );
  };

  console.log('currentSession bot', currentSession);
  const isFreshSession = !currentSession?.messages?.length;

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
