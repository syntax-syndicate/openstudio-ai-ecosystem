import { BotAvatar } from '@/app/(authenticated)/chat/components/bot-avatar';
import type { TBot } from '@/app/hooks/use-bots';
import { REVEAL_ANIMATION_VARIANTS } from '@/app/hooks/use-mdx';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { motion } from 'framer-motion';

export type TGreetingBubble = {
  bot: TBot;
};

export const GreetingBubble = ({ bot }: TGreetingBubble) => {
  return (
    <div className="mt-6 flex w-full flex-col gap-2 md:flex-row">
      <div className="px-0 py-1 md:px-3">
        <Tooltip content={bot?.name}>
          <BotAvatar size="small" name={bot?.name} avatar={bot?.avatar} />
        </Tooltip>
      </div>
      <div className="flex w-full flex-col items-start rounded-2xl">
        <div className="w-full py-1.5">
          <p className="text-sm md:text-base">
            <motion.span
              variants={REVEAL_ANIMATION_VARIANTS}
              className="text-zinc-700 tracking-[0.01em] dark:text-zinc-100"
              animate={'visible'}
              initial={'hidden'}
            >
              {bot.greetingMessage}
            </motion.span>
          </p>
        </div>
      </div>
    </div>
  );
};
