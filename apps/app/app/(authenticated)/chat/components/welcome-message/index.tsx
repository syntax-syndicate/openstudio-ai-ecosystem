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
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { ArrowRight, Github } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasShown = localStorage.getItem('welcomeMessageShown');
      if (wasShown !== 'true') {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);
  useEffect(() => {
    if (!open) {
      localStorage.setItem('welcomeMessageShown', 'true');
    }
  }, [open]);

  const messages = store((state) => state.messages);
  const currentMessage = store((state) => state.currentMessage);
  const isFreshSession = !messages?.length && !currentMessage;
  if (!show || !isFreshSession) return null;

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('welcomeMessageShown', 'true');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ariaTitle="Welcome Message"
        className="max-w-80vw rounded-xl md:max-w-[660px]"
      >
        <div className="flex w-full flex-row items-start justify-start gap-2">
          <div className="flex w-full scale-95 flex-col items-start md:scale-100 md:flex-row">
            <Flex
              direction="col"
              gap="lg"
              items="start"
              className="w-full flex-1 overflow-hidden p-0 md:p-4"
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
                      size="sm"
                      textColor="secondary"
                      className="flex gap-3"
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="mt-1 flex-shrink-0"
                      />
                      <p className="inline-block leading-7 md:leading-6">
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
                  className="mx-2 inline-block w-10 text-teal-400 dark:invert"
                />{' '}
              </Type>
              <Flex gap="md">
                <Button size="md" variant="default" onClick={handleClose}>
                  Start Chatting <ArrowRight size={16} />
                </Button>
                <Button
                  size="md"
                  variant="bordered"
                  onClick={() =>
                    window.open(
                      'https://github.com/kuluruvineeth/openstudio-beta',
                      '_blank'
                    )
                  }
                >
                  <Github size={16} /> Star us on GitHub
                </Button>
              </Flex>
            </Flex>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
