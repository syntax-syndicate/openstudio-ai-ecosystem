import { AIMessageBubble } from '@/app/(authenticated)/chat/components/ai-bubble';
import { useChatContext } from '@/app/context/chat/context';
import type { PromptProps, TChatMessage } from '@/app/hooks/use-chat-session';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { ArrowElbowDownRight } from '@phosphor-icons/react';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export type TRenderMessageProps = {
  id: string;
  humanMessage?: string;
  props?: PromptProps;
  model: TModelKey;
  image?: string;
  aiMessage?: string;
  loading?: boolean;
};

export type TMessageListByDate = Record<string, TChatMessage[]>;

moment().calendar(null, {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'DD/MM/YYYY',
});

export const ChatMessages = () => {
  const { currentSession, runModel } = useChatContext();
  const chatContainer = useRef<HTMLDivElement>(null);

  const isNewSession = currentSession?.messages.length === 0;

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  const renderMessage = (message: TChatMessage, isLast: boolean) => {
    return (
      <div className="flex w-full flex-col items-end gap-1" key={message.id}>
        {message?.props?.context && (
          <div className="flex flex-row gap-2 rounded-2xl border border-transparent bg-zinc-100 p-2 pr-4 pl-3 text-sm text-zinc-600 hover:border-white/5 dark:bg-black/30 dark:text-zinc-100">
            <ArrowElbowDownRight
              size={20}
              weight="bold"
              className="flex-shrink-0"
            />
            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {message?.props?.context}
            </span>
          </div>
        )}
        {message?.props?.image && (
          <Image
            src={message?.props?.image}
            alt="uploaded image"
            className="h-[120px] min-w-[120px] rounded-2xl border border-black/10 object-cover shadow-sm dark:border-white/10"
            width={0}
            sizes="50vw"
            height={0}
          />
        )}
        <div className="ml-16 flex flex-row gap-2 rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-black/30 dark:text-zinc-100">
          <span className="pt-[0.20em] pb-[0.15em] leading-6">
            {message.rawHuman}
          </span>
        </div>
        <AIMessageBubble chatMessage={message} isLast={isLast} />
      </div>
    );
  };

  // group messages by createdAt date by days
  const messagesByDate = currentSession?.messages.reduce(
    (acc: TMessageListByDate, message) => {
      const date = moment(message.createdAt).format('YYYY-MM-DD');
      if (acc?.[date]) {
        acc[date] = [...acc[date], message];
      } else {
        acc[date] = [message];
      }
      return acc;
    },
    {}
  );

  return (
    <div
      className="no-scrollbar flex h-screen w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
      id="chat-container"
    >
      <div className="flex w-[700px] flex-col gap-24">
        <div className="flex w-full flex-col items-start gap-8">
          {currentSession?.messages?.map((message, index) =>
            renderMessage(
              message,
              currentSession?.messages.length - 1 === index
            )
          )}
        </div>

        {/* {streamingMessage?.error && (
          <Alert variant="destructive">
            <Warning size={20} weight="bold" />
            <AlertTitle>Ahh! Something went wrong!</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )}  */}
      </div>
    </div>
  );
};
