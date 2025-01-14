import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-input/chat-examples';
import { AiModelsCopy } from '@/app/(authenticated)/chat/components/welcome-message/ai-models-copy';
import { CustomAssistantCopy } from '@/app/(authenticated)/chat/components/welcome-message/custom-assistant-copy';
import { OpenSourceCopy } from '@/app/(authenticated)/chat/components/welcome-message/opensource-copy';
import { PluginCopy } from '@/app/(authenticated)/chat/components/welcome-message/plugin-copy';
import { PrivacyCopy } from '@/app/(authenticated)/chat/components/welcome-message/privacy-copy';
import { useChatContext } from '@/context';
import {
  AiChat02Icon,
  AiLockIcon,
  AiMagicIcon,
  PuzzleIcon,
  Rocket01Icon,
} from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';

export type TWelcomeMessageProps = {
  show: boolean;
};

export type WelcomePoint = {
  icon: any;
  text: React.ReactNode;
};

const welcomePoints: WelcomePoint[] = [
  {
    icon: AiChat02Icon,
    text: <AiModelsCopy />,
  },
  {
    icon: PuzzleIcon,
    text: <PluginCopy />,
  },
  {
    icon: AiMagicIcon,
    text: <CustomAssistantCopy />,
  },
  {
    icon: AiLockIcon,
    text: <PrivacyCopy />,
  },
  {
    icon: Rocket01Icon,
    text: <OpenSourceCopy />,
  },
];
export const WelcomeMessage = ({ show }: TWelcomeMessageProps) => {
  const { store } = useChatContext();
  const messages = store((state) => state.messages);
  const currentMessage = store((state) => state.currentMessage);
  const isFreshSession = !messages?.length && !currentMessage;
  if (!show || !isFreshSession) return null;
  return (
    <div className="flex w-full flex-row items-start justify-start gap-2">
      <div className="flex w-full flex-col items-start md:flex-row">
        <Flex
          direction="col"
          gap="md"
          items="start"
          className="w-full flex-1 overflow-hidden px-8"
        >
          <Type size="lg" className="pb-2">
            Power Up Your
            <Flex className="mx-1 inline-block">
              <Image
                src={'./icons/handdrawn_spark.svg'}
                width={0}
                alt="spark"
                height={0}
                className={cn(
                  'relative mx-1 h-4 w-10 translate-y-1 overflow-hidden dark:invert'
                )}
                sizes="100vw"
              />
            </Flex>
            Conversations
          </Type>
          <Flex direction="col" gap="xl" items="start">
            {welcomePoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <Type
                  key={index}
                  size="base"
                  textColor="secondary"
                  className="flex gap-3"
                >
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="mt-1 flex-shrink-0"
                  />
                  <p className="inline-block leading-6 tracking-[0.015em]">
                    {point.text}
                  </p>
                </Type>
              );
            })}
          </Flex>
          <Type size="sm" textColor="secondary" className="pt-2">
            Start chatting now - it&apos;s{' '}
            <Image
              src={'./icons/handdrawn_free.svg'}
              width={0}
              alt="sparck"
              height={0}
              className="mx-2 inline-block w-10 text-cyan-400 dark:invert"
            />{' '}
          </Type>
          <div
            className="relative mx-1 my-3 h-2 w-full opacity-10 dark:invert"
            style={{
              backgroundImage: 'url("./icons/wavy.svg")',
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'contain',
              backgroundPosition: '0 0',
            }}
          />
          <ChatExamples />
        </Flex>
      </div>
    </div>
  );
};
