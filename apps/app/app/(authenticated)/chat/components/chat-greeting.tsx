import { WavingHand02Icon } from '@repo/design-system/components/ui/icons';
import { motion } from 'framer-motion';

export const ChatGreeting = () => {
  return (
    <div className="flex w-full flex-row items-start justify-start gap-2 md:w-[720px]">
      <motion.h1
        className="py-2 text-left font-semibold text-3xl text-zinc-800 leading-9 tracking-tight dark:text-zinc-100"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 1,
          },
        }}
      >
        <span className="flex flex-row items-center gap-1 text-zinc-300 dark:text-zinc-500">
          <WavingHand02Icon size={32} variant="stroke" strokeWidth="2" />
          Hello,
        </span>
        How can I help you today? 😊
      </motion.h1>
    </div>
  );
};
