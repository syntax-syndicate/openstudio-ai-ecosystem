import { useChatContext } from '@/context';
import { slideUpVariant } from '@/helper/animations';
import { Flex } from '@repo/design-system/components/ui/flex';
import { StaggerContainer } from '@repo/design-system/components/ui/stagger-container';
import { Type } from '@repo/design-system/components/ui/text';
import { motion } from 'framer-motion';

export type StarterMessage = {
  name: string;
  content: string;
};
export type StarterMessages = {
  messages: StarterMessage[];
};

export const StarterMessages = ({ messages }: StarterMessages) => {
  const { store } = useChatContext();
  const editor = store((state) => state.editor);

  return (
    <Flex
      direction="col"
      gap="lg"
      justify="center"
      items="center"
      className="w-full py-1"
    >
      <Type size="xs" textColor="tertiary">
        Try these example prompts or craft your own message
      </Type>
      <StaggerContainer>
        <div className="flex flex-wrap justify-center gap-1.5 overflow-x-auto md:grid-cols-2">
          {messages?.slice(0, 3)?.map((prompt, index) => (
            <motion.div key={prompt.name} variants={slideUpVariant}>
              <Flex
                key={index}
                direction="col"
                className="!text-sm w-full cursor-pointer justify-start gap-3 rounded-full border border-zinc-500/20 bg-zinc-500/5 px-3 py-0.5 font-medium opacity-100 shadow-sm hover:opacity-80"
                onClick={() => {
                  editor?.commands?.clearContent();
                  editor?.commands?.setContent(prompt.content);
                  editor?.commands?.focus('end');
                }}
              >
                {prompt.name}
              </Flex>
            </motion.div>
          ))}
        </div>
      </StaggerContainer>
    </Flex>
  );
};
