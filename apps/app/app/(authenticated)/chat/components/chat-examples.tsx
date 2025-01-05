import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import { ChatGreeting } from '@/app/(authenticated)/chat/components/chat-greeting';
import { useBots } from '@/app/context/bots/context';
import { useChatContext } from '@/app/context/chat/provider';
import { usePrompts } from '@/app/context/prompts/context';
import { ArrowDown, ArrowRight } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { motion } from 'framer-motion';

export type TChatExamples = {};
export const ChatExamples = () => {
  const { allPrompts } = usePrompts();
  const { allBots, open: openBots } = useBots();
  const { editor } = useChatContext();
  return (
    <Flex
      direction="col"
      gap="md"
      className="h-screen flex-1"
      justify="center"
      items="center"
    >
      {!!allPrompts?.length && <ChatGreeting />}
      <div className="mb-2 flex flex-col gap-3">
        <div className="grid w-full grid-cols-2 gap-1 md:w-[700px] md:grid-cols-4 md:gap-3 lg:w-[720px]">
          {allPrompts.slice(0, 3)?.map((example, index) => (
            <motion.div
              initial={{
                opacity: 0,
              }}
              className="relative flex min-h-[140px] w-full cursor-pointer flex-col items-start gap-4 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 md:px-4 md:py-3 md:text-base dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-black/20"
              key={index}
              animate={{
                opacity: 1,
              }}
              onClick={() => {
                editor?.commands?.clearContent();
                editor?.commands?.setContent(example.content);
                editor?.commands?.focus('end');
              }}
            >
              <p className="w-full font-medium text-sm text-zinc-800 tracking-[-0.02em] md:text-base dark:text-white">
                {example.name}
              </p>
              <Button
                size="iconXS"
                rounded="full"
                variant="secondary"
                className="absolute right-4 bottom-4"
              >
                <ArrowDown size={15} weight="bold" />
              </Button>
            </motion.div>
          ))}
          <motion.div
            initial={{
              opacity: 0,
            }}
            className="relative flex w-full cursor-pointer flex-col items-start gap-4 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 md:px-4 md:py-3 md:text-base dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-black/20"
            animate={{
              opacity: 1,
            }}
            onClick={() => {
              openBots();
            }}
          >
            <p className="w-full font-medium text-sm text-zinc-800 md:text-base dark:text-white">
              Popular bots
            </p>
            <Flex gap="sm">
              {allBots?.map((bot) => (
                <Tooltip content={bot.name} key={bot.id}>
                  <BotAvatar name={bot.name} avatar={bot.avatar} size="small" />
                </Tooltip>
              ))}
            </Flex>
            <Button
              size="iconXS"
              rounded="full"
              variant="secondary"
              className="absolute right-4 bottom-4"
            >
              <ArrowRight size={15} weight="bold" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Flex>
  );
};
