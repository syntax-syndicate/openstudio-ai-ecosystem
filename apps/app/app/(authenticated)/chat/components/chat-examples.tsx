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
              scale: 0.9,
              opacity: 0,
            }}
            transition={{ delay: 1 }}
            className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-2xl border border-white/5 bg-zinc-800 px-4 py-3 text-sm text-zinc-400 hover:scale-[101%] hover:bg-black/20"
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
                index === 0 && 'text-purple-400',
                index === 1 && 'text-green-400',
                index === 2 && 'text-blue-400'
              )}
            />
            <p className="w-full font-semibold text-sm text-white">
              {example.title}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
