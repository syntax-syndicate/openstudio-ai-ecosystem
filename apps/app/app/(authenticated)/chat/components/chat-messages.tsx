import { AIMessageBubble } from '@/app/(authenticated)/chat/components/ai-bubble';
import { useChatContext } from '@/app/context/chat/context';
import type { PromptProps, TChatMessage } from '@/app/hooks/use-chat-session';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { getRelativeDate } from '@/app/lib/date';
import { ArrowElbowDownRight, Warning } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { Avatar } from '@repo/design-system/components/ui/custom-avatar';
import { LabelDivider } from '@repo/design-system/components/ui/label-divider';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
export type TRenderMessageProps = {
  id: string;
  humanMessage: string;
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
  const { streamingMessage, currentSession } = useChatContext();
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
    if (streamingMessage) {
      scrollToBottom();
    }
  }, [streamingMessage]);

  const isLastStreamBelongsToCurrentSession =
    streamingMessage?.sessionId === currentSession?.id;

  const renderMessage = (props: TRenderMessageProps) => {
    return (
      <div className="flex w-full flex-col items-start gap-1" key={props.id}>
        {props.props?.context && (
          <div className="flex flex-row gap-2 rounded-2xl border border-transparent bg-transparent bg-zinc-800 p-2 pr-4 pl-3 text-sm text-zinc-200 hover:border-white/5 dark:bg-black/30">
            <ArrowElbowDownRight
              size={20}
              weight="bold"
              className="flex-shrink-0"
            />
            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {props.props?.context}
            </span>
          </div>
        )}
        {props?.props?.image && (
          <Image
            src={props?.props?.image}
            alt="uploaded image"
            className="h-[120px] min-w-[120px] rotate-6 rounded-2xl border border-white/5 object-cover shadow-md"
            width={0}
            height={0}
          />
        )}
        <div className="dark flex flex-row gap-2 rounded-2xl bg-zinc-800 p-2 pr-4 text-sm text-zinc-200 dark:bg-black/30">
          <Avatar name="Vineeth" size="sm" />
          <span className="pt-[0.20em] pb-[0.15em] leading-6">
            {props.humanMessage}
          </span>
        </div>
        <AIMessageBubble {...props} />
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
        {messagesByDate &&
          Object.keys(messagesByDate).map((date) => {
            return (
              <div className="flex flex-col" key={date}>
                <LabelDivider label={getRelativeDate(date)} />
                <div className="flex w-full flex-col items-start gap-12">
                  {messagesByDate[date].map((message) =>
                    renderMessage({
                      id: message.id,
                      humanMessage: message.rawHuman,
                      model: message.model,
                      image: message.image,
                      props: message.props,
                      aiMessage: message.rawAI,
                    })
                  )}
                </div>
              </div>
            );
          })}
        {isLastStreamBelongsToCurrentSession &&
          streamingMessage?.props?.query &&
          !streamingMessage?.error &&
          renderMessage({
            id: 'streaming',
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            model: streamingMessage?.model,
            image: streamingMessage?.props?.image,
            loading: streamingMessage?.loading,
          })}
        {streamingMessage?.error && (
          <Alert variant="destructive">
            <Warning size={20} weight="bold" />
            <AlertTitle>Ahh! Something went wrong!</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};
