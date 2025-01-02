import { zoomVariant } from '@/app/(authenticated)/chat/components/chat-input';
import { LabelDivider } from '@repo/design-system/components/ui/label-divider';
import { motion } from 'framer-motion';

export type TExample = {
  title: string;
  prompt: string;
};

export type TChatExamples = {
  examples: TExample[];
  onExampleClick: (prompt: string) => void;
};

export const ChatExamples = ({ examples, onExampleClick }: TChatExamples) => {
  return (
    <div className="flex flex-col gap-1">
      <LabelDivider
        label={'Examples'}
        className="pt-0"
        transitionDuration={4}
      />
      <div className="grid w-[700px] grid-cols-3 gap-2">
        {examples?.map((example, index) => (
          <motion.div
            variants={zoomVariant}
            transition={{ delay: 1 }}
            initial={'initial'}
            animate={'animate'}
            className="flex w-full cursor-pointer flex-col items-start gap-2 rounded-2xl border border-white/5 px-4 py-3 text-sm text-zinc-400 hover:scale-[101%] hover:bg-black/20"
            key={index}
            onClick={() => {
              onExampleClick(example.prompt);
            }}
          >
            <p className="w-full font-semibold text-sm text-white">
              {example.title}
            </p>
            <p className="w-full truncate text-xs text-zinc-500">
              {example.prompt}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
