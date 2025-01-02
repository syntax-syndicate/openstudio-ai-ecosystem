import { examplePrompts } from '@/app/lib/prompts';
import { StarFour } from '@phosphor-icons/react';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';

export type TChatExamples = {
  onExampleClick: (prompt: string) => void;
};
export const ChatExamples = ({ onExampleClick }: TChatExamples) => {
  return (
    <div className="mt-8 flex flex-col gap-1">
      <div className="grid w-[700px] grid-cols-3 gap-4">
        {examplePrompts?.map((example, index) => (
          <motion.div
            initial={{
              rotate: 0,
              scale: 0.8,
              opacity: 0,
            }}
            className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-2xl border border-dark/10 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-black/20"
            key={index}
            animate={{
              rotate: index % 2 === 0 ? -2 : 2,
              scale: 1,
              opacity: 1,
            }}
            whileHover={{
              scale: 1.05,
              rotate: index % 2 === 0 ? -1 : 1,
            }}
            onClick={() => {
              onExampleClick(example.prompt);
            }}
          >
            <StarFour
              size={20}
              weight="bold"
              className={cn(
                index === 0 && 'text-purple-500 dark:text-purple-400',
                index === 1 && 'text-teal-500 dark:text-teal-400',
                index === 2 && 'text-blue-500 dark:text-blue-400'
              )}
            />
            <p className="w-full font-medium text-sm text-zinc-800 dark:text-white">
              {example.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
