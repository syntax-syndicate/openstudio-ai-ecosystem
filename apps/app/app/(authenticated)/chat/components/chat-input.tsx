import { useChatContext } from '@/app/context/chat/context';
import { PromptType, RoleType } from '@/app/lib/prompts';
import { Command, Plus, Sparkle } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

const slideUpVariant = {
  initial: { y: 50, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};
const zoomVariant = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeInOut', delay: 1 },
  },
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const { runModel, createSession, currentSession, streamingMessage } =
    useChatContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: inputValue,
        },
        sessionId!.toString()
      );
      setInputValue('');
    }
  };

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isNewSession =
    !currentSession?.messages?.length && !streamingMessage?.loading;

  const examples = [
    'What is the capital of France?',
    'What is the weather in New York?',
    'What is the population of India?',
    'What is the GDP of China?',
  ];

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-center gap-6 bg-gradient-to-t from-70% from-white to-white/10 px-4 pt-16 pb-4 transition-all duration-1000 ease-in-out dark:from-zinc-800 dark:to-transparent',
        isNewSession && 'top-0'
      )}
    >
      {isNewSession && (
        <div className="flex w-[680px] flex-row items-center justify-start gap-2">
          <motion.h1
            className="font-semibold text-2xl text-zinc-100 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 1,
              },
            }}
          >
            <span className="text-zinc-500">Hello! 👋 </span>
            <br />
            What can I help you with today? 😊
          </motion.h1>
        </div>
      )}
      <motion.div
        variants={slideUpVariant}
        initial={'initial'}
        animate={'animate'}
        className="flex w-[700px] flex-row items-center rounded-2xl bg-white/10 px-3"
      >
        {isNewSession ? (
          <div className="flex h-8 min-w-8 items-center justify-center">
            <Sparkle size={24} weight="fill" />
          </div>
        ) : (
          <Button
            size="icon"
            className="h-8 min-w-8"
            onClick={() => {
              createSession().then((session) => {
                router.push(`/chat/${session.id}`);
              });
            }}
          >
            <Plus size={16} weight="bold" />
          </Button>
        )}
        <Input
          placeholder="Ask AI anything.."
          value={inputValue}
          ref={inputRef}
          autoComplete="off"
          autoCapitalize="off"
          variant="ghost"
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <Badge>
          <Command size={14} weight="bold" />K
        </Badge>
      </motion.div>
      {isNewSession && (
        <div className="grid w-[700px] grid-cols-2 gap-2">
          {examples?.map((example, index) => (
            <motion.div
              variants={zoomVariant}
              transition={{ delay: 1 }}
              initial={'initial'}
              animate={'animate'}
              className="flex w-full cursor-pointer flex-row items-center rounded-2xl border border-white/5 bg-black/10 px-4 py-3 text-sm text-zinc-400 hover:scale-[101%] hover:bg-black/20"
              key={index}
              onClick={() => {
                runModel(
                  {
                    role: RoleType.assistant,
                    type: PromptType.ask,
                    query: example,
                  },
                  sessionId!.toString()
                );
              }}
            >
              {example}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
