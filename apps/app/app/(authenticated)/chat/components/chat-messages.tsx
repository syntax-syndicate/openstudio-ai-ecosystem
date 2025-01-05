import { AIMessageBubble } from '@/app/(authenticated)/chat/components/ai-bubble';
import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { GreetingBubble } from '@/app/(authenticated)/chat/components/greeting-bubble';
import { useBots } from '@/app/context/bots/context';
import { useSessionsContext } from '@/app/context/sessions/provider';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import type { TRunModel } from '@/app/hooks/use-llm';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { removeExtraSpaces } from '@/app/lib/helper';
import { ArrowElbowDownRight, TrashSimple } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Type } from '@repo/design-system/components/ui/text';
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

export const ChatMessages = () => {
  const { currentSession, refetchCurrentSession } = useSessionsContext();
  const { updateSessionMutation } = useSessionsContext();
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

  console.log('currentSession bot', currentSession);

  return (
    <div
      className="no-scrollbar flex h-[100dvh] w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
      id="chat-container"
    >
      <div className="flex w-full flex-col gap-24 md:w-[700px] md:p-2 lg:w-[720px]">
        {currentSession?.bot && (
          <div className="flex flex-col items-center gap-2">
            <BotAvatar
              name={currentSession.bot.name}
              size="medium"
              avatar={currentSession?.bot?.avatar}
            />
            <Type size="base" weight="medium" textColor="primary">
              {currentSession.bot.name}
            </Type>
            <Type
              size="xs"
              className="text-center md:max-w-[400px]"
              textColor="tertiary"
            >
              {currentSession.bot.description}
            </Type>
            {!currentSession?.messages?.length && (
              <div className="flex flex-row gap-1">
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
                      updateSessionMutation.mutate(
                        {
                          sessionId: currentSession.id,
                          session: {
                            bot: undefined,
                            updatedAt: moment().toISOString(),
                          },
                        },
                        {
                          onSuccess: () => {
                            refetchCurrentSession?.();
                          },
                        }
                      );
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
      </div>
    </div>
  );
};
