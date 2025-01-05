import { WavingHand02Icon } from '@hugeicons/react';
import { motion } from 'framer-motion';
import moment from 'moment';

export const ChatGreeting = () => {
  const renderGreeting = (name: string) => {
    const date = moment();
    const hours = date.get('hour');
    if (hours < 12) return `Good Morning,`;
    if (hours < 18) return `Good Afternoon,`;
    return `Good Evening,`;
  };
  return (
    <div className="flex w-[720px] flex-row items-start justify-start gap-2">
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
