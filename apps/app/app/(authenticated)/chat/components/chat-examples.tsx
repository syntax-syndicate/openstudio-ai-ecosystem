import { examplePrompts } from '@/app/lib/prompts';
import { motion } from 'framer-motion';

export type TChatExamples = {
  onExampleClick: (prompt: string) => void;
  show: boolean;
};
export const ChatExamples = ({ onExampleClick, show }: TChatExamples) => {
  if (!show) return null;
  return (
    <div className="mt-2 flex flex-col gap-3">
      <div className="grid w-[700px] grid-cols-4 gap-3">
        {examplePrompts?.map((example, index) => (
          <motion.div
            initial={{
              opacity: 0,
            }}
            className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-600 hover:bg-zinc-50 dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-black/20"
            key={index}
            animate={{
              opacity: 1,
            }}
            onClick={() => {
              onExampleClick(example.prompt);
            }}
          >
            <p className="w-full font-medium text-sm text-zinc-800 dark:text-white">
              {example.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
