import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-examples';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { PromptType, RoleType } from '@/app/lib/prompts';
import {
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Plus,
  Quotes,
  StarFour,
  StopCircle,
  X,
} from '@phosphor-icons/react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { encodingForModel } from 'js-tiktoken';
import moment from 'moment';
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

export const zoomVariant = {
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
  const { showButton, scrollToBottom } = useScrollToBottom();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
  const [inputValue, setInputValue] = useState('');
  const { runModel, createSession, currentSession, streamingMessage } =
    useChatContext();

  const { selectedText, showPopup } = useTextSelection();
  const inputRef = useRef<HTMLInputElement>(null);

  const enc = encodingForModel('gpt-3.5-turbo');

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
    {
      title: 'Implement JWT Auth for Express.js',
      prompt:
        'Develop a secure user authentication system in a Node.js application using JSON Web Tokens (JWT) for authorization and authentication.',
    },
    {
      title: 'The Nature of Reality',
      prompt:
        'Discuss the concept of reality from both a subjective and objective perspective, incorporating theories from famous philosophers.',
    },
    {
      title: 'Professional Meeting Follow-Up',
      prompt:
        'Write a follow-up email to a potential employer after a job interview, expressing gratitude for the opportunity and reiterating your interest in the position.',
    },
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

  const renderGreeting = (name: string) => {
    const date = moment();
    const hours = date.get('hour');
    if (hours < 12) return `Good Morning, ${name}.`;
    if (hours < 18) return `Good Afternoon, ${name}.`;
    return `Good Evening, ${name}.`;
  };

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-t from-70% from-white to-white/10 px-4 pt-16 pb-4 transition-all duration-1000 ease-in-out dark:from-zinc-800 dark:to-transparent',
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
            <span className="text-zinc-500">
              {renderGreeting('Vineeth')} 👋{' '}
            </span>
            <br />
            How can I help you today? 😊
          </motion.h1>
        </div>
      )}
      <div className="flex flex-row items-center gap-2">
        {showButton && !showPopup && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button onClick={scrollToBottom} variant="secondary" size="iconSm">
              <ArrowDown size={20} weight="bold" />
            </Button>
          </motion.span>
        )}
        {showPopup && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Button onClick={() => {}} variant="secondary" size="sm">
              <Quotes size={20} weight="bold" /> Reply
            </Button>
          </motion.span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <motion.div
          variants={slideUpVariant}
          initial={'initial'}
          animate={'animate'}
          className="flex w-[700px] flex-col gap-0 rounded-[1.25rem] bg-white/10"
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
              placeholder="Ask AI anything ..."
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

            <Button size="icon" variant="ghost" className="ml-1 h-8 min-w-8">
              <ArrowUp size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-2 p-2">
            <ModelSelect />

            <div className="flex-1"></div>

            <Button
              variant="secondary"
              size="sm"
              onClick={openFilters}
              className="px-1.5"
            >
              <ClockClockwise size={16} weight="bold" /> History
              <Badge>
                <Command size={12} weight="bold" /> K
              </Badge>
            </Button>
          </div>
        </motion.div>
      </div>
      {isNewSession && (
        <ChatExamples
          examples={examples}
          onExampleClick={(prompt) => {
            setInputValue(prompt);
            runModel(
              {
                role: RoleType.assistant,
                type: PromptType.ask,
                query: prompt,
              },
              sessionId!.toString()
            );
          }}
        />
      )}
    </div>
  );
};
