import { examplePrompts } from '@/app/lib/prompts';
import { Asterisk } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

export type TChatExamples = {
  onExampleClick: (prompt: string) => void;
  show: boolean;
};
export const ChatExamples = ({ onExampleClick, show }: TChatExamples) => {
  if (!show) return null;
  return (
    <div className="mb-2 flex flex-col gap-3">
      <div className="grid w-full grid-cols-2 gap-1 md:w-[700px] md:grid-cols-4 md:gap-3">
        {examplePrompts?.map((example, index) => (
          <motion.div
            initial={{
              opacity: 0,
            }}
            className="flex w-full cursor-pointer flex-col items-start gap-4 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 md:px-4 md:py-3 md:text-base dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-black/20"
            key={index}
            animate={{
              opacity: 1,
            }}
            onClick={() => {
              onExampleClick(example.prompt);
            }}
          >
            <Asterisk size={20} weight="bold" />
            <p className="w-full font-medium text-sm text-zinc-800 md:text-base dark:text-white">
              {example.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
