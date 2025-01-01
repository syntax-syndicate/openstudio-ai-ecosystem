import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import { PromptType, RoleType } from '@/app/lib/prompts';
import {
  ArrowElbowDownLeft,
  ClockClockwise,
  Command,
  Microphone,
  Plus,
  StarFour,
  StopCircle,
  X,
} from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
  const { open: openFilters } = useFilters();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
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

  useEffect(() => {
    if (text) {
      setInputValue(text);
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: text,
        },
        sessionId!.toString()
      );
      setInputValue('');
    }
  }, [text]);

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
            <span className="text-zinc-500">Good morning! 👋 </span>
            <br />
            How can I help you with today? 😊
          </motion.h1>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <motion.div
          variants={slideUpVariant}
          initial={'initial'}
          animate={'animate'}
          className="flex w-[700px] flex-col gap-0 rounded-2xl bg-white/10 "
        >
          <div className="flex h-14 w-full flex-row items-center gap-0 px-3">
            {isNewSession ? (
              <div className="flex h-8 min-w-8 items-center justify-center">
                <StarFour size={24} weight="fill" />
              </div>
            ) : (
              <Button
                size="icon"
                variant={'ghost'}
                className="h-8 min-w-8"
                onClick={() => {
                  createSession().then((session) => {
                    router.push(`/chat/${session.id}`);
                  });
                }}
              >
                <Plus size={20} weight="bold" />
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
              className="px-2"
            />
            {recording ? (
              <div className="flex h-10 flex-row items-center rounded-xl bg-black/50 px-2 py-1">
                <AudioWaveSpinner />
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => {
                    stopRecording();
                  }}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <StopCircle
                    size={20}
                    weight="fill"
                    className="text-red-300"
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="iconXS"
                  rounded="default"
                  onClick={() => {
                    stopRecording();
                  }}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <X size={12} weight="bold" />
                </Button>
              </div>
            ) : transcribing ? (
              <Spinner />
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 min-w-8"
                onClick={() => {
                  startRecording();
                  setTimeout(() => {
                    stopRecording();
                  }, 20000);
                }}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
              >
                <Microphone size={20} weight="bold" />
              </Button>
            )}

            <div className="flex h-8 min-w-8 items-center justify-center">
              <ArrowElbowDownLeft size={16} weight="bold" />
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-2 p-2">
            <ModelSelect />
            {/* <Button variant="secondary" size="sm">
              <Book size={16} weight="bold" /> Prompts
            </Button>
            <Button variant="secondary" size="sm">
              <GearSix size={16} weight="bold" /> Settings
            </Button> */}
            <div className="flex-1"></div>

            <Button variant="secondary" size="sm" onClick={openFilters}>
              <ClockClockwise size={16} weight="bold" /> History
              <Badge>
                <Command size={12} weight="bold" /> K
              </Badge>
            </Button>
          </div>
        </motion.div>
      </div>
      {isNewSession && (
        <div className="grid w-[700px] grid-cols-2 gap-2">
          {examples?.map((example, index) => (
            <motion.div
              variants={zoomVariant}
              transition={{ delay: 1 }}
              initial={'initial'}
              animate={'animate'}
              className="flex w-full cursor-pointer flex-row items-center rounded-2xl border border-white/5 px-4 py-3 text-sm text-zinc-400 hover:scale-[101%] hover:bg-black/20"
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
