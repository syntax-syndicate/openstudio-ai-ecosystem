import { useChatContext } from '@/app/context';
import { ArrowRight02Icon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { motion } from 'framer-motion';

export type TChatExamples = {};
export const ChatExamples = () => {
  const { editor } = useChatContext();

  const allPrompts = [
    {
      id: '621d5e4f-4b56-4302-97cd-5b837b6296ab',
      created_at: '2024-06-09T07:38:30.220026+00:00',
      name: 'Craft Engaging Marketing Email Copy',
      content:
        'Write marketing copy to make my marketing emails more engaging. The copy must be about our {{{{product, service, or company}}}} ',
      category: 'Marketing',
    },
    {
      id: '779820b7-f900-4b8b-a03b-1f01bddf2980',
      created_at: '2024-06-11T08:38:00.996295+00:00',
      name: 'Generate a SQL query',
      content:
        'Generate a SQL query to {{{{count and sort unique logins in the last month}}}}',
      category: 'coding',
    },
    {
      id: '2a502ea1-88fe-4bbf-946e-e78a08eee0d3',
      created_at: '2024-06-11T10:47:30.506062+00:00',
      name: 'Suggest python library to solve a problem',
      content: 'Suggest python library to solve {{{{a problem}}}}',
      category: 'coding',
    },
    {
      id: '83b98019-5885-4d59-becc-827a8587e0bb',
      created_at: '2024-06-11T10:50:02.82221+00:00',
      name: 'Design a fun coding game',
      content: 'Design a fun {{{{snake paper}}}} coding game',
      category: 'coding',
    },
  ];

  return (
    <Flex direction="col" gap="md" justify="center" items="center">
      <div className="flex flex-col gap-3 p-4">
        <Type size="sm" textColor="tertiary">
          Try Prompts
        </Type>
        <div className="flex w-full flex-col gap-1 md:w-[700px] md:gap-3 lg:w-[720px]">
          {allPrompts?.slice(0, 3)?.map((example, index) => (
            <motion.div
              initial={{
                opacity: 0,
              }}
              className="relative flex w-full cursor-pointer flex-row items-center gap-2 bg-white text-sm text-zinc-600 md:text-base dark:border-white/5 dark:bg-zinc-800 dark:text-zinc-400"
              key={index}
              animate={{
                opacity: 1,
              }}
              onClick={() => {
                editor?.commands?.clearContent();
                editor?.commands?.setContent(example.content);
                editor?.commands?.focus('end');
              }}
            >
              <ArrowRight02Icon size={18} variant="solid" strokeWidth="2" />
              <p className="w-full font-medium text-sm text-zinc-800 hover:underline hover:decoration-zinc-500 hover:underline-offset-4 md:text-base dark:text-white">
                {example.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Flex>
  );
};
