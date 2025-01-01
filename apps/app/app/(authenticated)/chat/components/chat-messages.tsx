import { AIMessageBubble } from '@/app/(authenticated)/chat/components/ai-bubble';
import { useChatContext } from '@/app/context/chat/context';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { getRelativeDate } from '@/app/lib/date';
import { Warning } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { Avatar } from '@repo/design-system/components/ui/custom-avatar';
import { motion } from 'framer-motion';
import moment from 'moment';
import { useEffect, useRef } from 'react';

export type TRenderMessageProps = {
  key: string;
  humanMessage: string;
  model: TModelKey;
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
    const { key, humanMessage } = props;
    return (
      <div className="flex w-full flex-col items-start gap-1" key={key}>
        <motion.div
          className="flex flex-row gap-2 rounded-2xl border border-white/5 bg-black/30 p-2 pr-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: 'easeInOut' },
          }}
        >
          <Avatar name="Vineeth" />
          <span className="pt-[0.35em] pb-[0.25em] leading-6">
            {humanMessage}
          </span>
        </motion.div>
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
      className="flex h-screen w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
    >
      <motion.div
        className="flex w-[600px] flex-col gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: 'easeInOut' } }}
      >
        {messagesByDate &&
          Object.keys(messagesByDate).map((date) => {
            return (
              <div className="flex flex-col">
                <div className="flex w-full flex-row items-center pt-8 pb-4">
                  <div className="h-[1px] w-full bg-white/5"></div>
                  <p className="flex-shrink-0 px-2 text-xs text-zinc-500">
                    {getRelativeDate(date)}
                  </p>
                  <div className="h-[1px] w-full bg-white/5"></div>
                </div>
                <div className="flex w-full flex-col items-start gap-4">
                  {messagesByDate[date].map((message) =>
                    renderMessage({
                      key: message.id,
                      humanMessage: message.rawHuman,
                      model: message.model,
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
            key: 'streaming',
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            model: streamingMessage?.model,
            loading: streamingMessage?.loading,
          })}
        {streamingMessage?.error && (
          <Alert variant="destructive">
            <Warning size={20} weight="bold" />
            <AlertTitle>Ahh! Something went wrong!</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
};
