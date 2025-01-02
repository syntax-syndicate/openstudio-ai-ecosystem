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
    <div className="flex w-[680px] flex-row items-center justify-start gap-2">
      <motion.h1
        className="font-semibold text-2xl text-zinc-700 tracking-tight dark:text-zinc-100"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: {
            duration: 1,
          },
        }}
      >
        <span className="text-zinc-400 dark:text-zinc-500">
          {renderGreeting('Vineeth')}
        </span>
        <br />
        How can I help you today? 😊
      </motion.h1>
    </div>
  );
};
