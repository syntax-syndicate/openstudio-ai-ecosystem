import { AIMessageBubble } from '@/app/(authenticated)/chat/components/ai-bubble';
import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { GreetingBubble } from '@/app/(authenticated)/chat/components/greeting-bubble';
import { useBots } from '@/app/context/bots/context';
import { useChatContext } from '@/app/context/chat/context';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import { useChatSession } from '@/app/hooks/use-chat-session';
import type { TRunModel } from '@/app/hooks/use-llm';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { removeExtraSpaces } from '@/app/lib/helper';
import { ArrowElbowDownRight, Info, TrashSimple } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export type TRenderMessageProps = {
  id: string;
  humanMessage?: string;
  props?: TRunModel;
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
  const { currentSession, refetchCurrentSession } = useChatContext();
  const { updateSession } = useChatSession();
  const chatContainer = useRef<HTMLDivElement>(null);
  const { open: openBot } = useBots();

  const isNewSession = currentSession?.messages.length === 0;

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages?.length]);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  const renderMessage = (message: TChatMessage, isLast: boolean) => {
    return (
      <div className="flex w-full flex-col items-end gap-1" key={message.id}>
        {message.runModelProps?.context && (
          <div className="flex flex-row gap-2 rounded-2xl border border-transparent bg-zinc-50 p-2 pr-4 pl-3 text-sm text-zinc-600 hover:border-white/5 md:text-base dark:bg-black/30 dark:text-zinc-100">
            <ArrowElbowDownRight
              size={20}
              weight="bold"
              className="flex-shrink-0"
            />

            <span className="pt-[0.35em] pb-[0.25em] leading-6">
              {message.runModelProps?.context}
            </span>
          </div>
        )}
        {message?.runModelProps?.image && (
          <Image
            src={message?.runModelProps?.image}
            alt="uploaded image"
            className="h-[120px] min-w-[120px] rounded-2xl border border-black/10 object-cover shadow-sm dark:border-white/10"
            width={0}
            sizes="50vw"
            height={0}
          />
        )}
        <div className="ml-16 flex flex-row gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:text-base dark:bg-black/30 dark:text-zinc-100">
          <span className="whitespace-pre-wrap pt-[0.20em] pb-[0.15em] leading-6">
            {removeExtraSpaces(message.rawHuman)}
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
      className="no-scrollbar flex h-[100dvh] w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
      id="chat-container"
    >
      <div className="flex w-full flex-col gap-24 p-4 md:w-[700px] md:p-0">
        {currentSession?.bot && (
          <div className="flex flex-col items-center gap-2">
            <BotAvatar
              name={currentSession.bot.name}
              size="medium"
              avatar={currentSession?.bot?.avatar}
            />
            <p className="font-medium text-sm text-zinc-800 md:text-base dark:text-white">
              {currentSession.bot.name}
            </p>
            <p className="text-center text-xs text-zinc-500 md:max-w-[400px] md:text-sm">
              {currentSession.bot.description}
            </p>
            {!currentSession?.messages?.length && (
              <div className="flex flex-row gap-1">
                <Tooltip content="Bot Info">
                  <Button variant="outline" size="iconSm" onClick={() => {}}>
                    <Info size={16} weight="bold" />
                  </Button>
                </Tooltip>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openBot('public');
                  }}
                >
                  Change Bot
                </Button>
                <Tooltip content="Remove bot">
                  <Button
                    variant="outline"
                    size="iconSm"
                    onClick={() => {
                      updateSession(currentSession.id, { bot: undefined });
                      refetchCurrentSession();
                    }}
                  >
                    <TrashSimple size={16} weight="bold" />
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        )}
        <div className="flex w-full flex-col items-start gap-8">
          {currentSession?.bot && <GreetingBubble bot={currentSession?.bot} />}
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
        )} */}
      </div>
    </div>
  );
};
