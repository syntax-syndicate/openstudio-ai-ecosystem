import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-examples';
import { ChatGreeting } from '@/app/(authenticated)/chat/components/chat-greeting';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { slideUpVariant } from '@/app/lib/framer-motion';
import { PromptType, RoleType } from '@/app/lib/prompts';
import {
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Plus,
  Quotes,
  StarFour,
  Stop,
  StopCircle,
  X,
} from '@phosphor-icons/react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { encodingForModel } from 'js-tiktoken';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
  const [inputValue, setInputValue] = useState('');
  const [contextValue, setContextValue] = useState<string>('');
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const {
    runModel,
    createSession,
    currentSession,
    streamingMessage,
    stopGeneration,
  } = useChatContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const enc = encodingForModel('gpt-3.5-turbo');

  const handleRunModel = () => {
    runModel(
      {
        role: RoleType.assistant,
        type: PromptType.ask,
        query: inputValue,
        context: contextValue,
      },
      sessionId!.toString()
    );
    setContextValue('');
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunModel();
    }
  };

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isNewSession =
    !currentSession?.messages?.length && !streamingMessage?.loading;

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

  const renderRecordingControls = () => {
    if (recording) {
      return (
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
            <StopCircle size={20} weight="fill" className="text-red-300" />
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
      );
    }
    if (transcribing) {
      return <Spinner />;
    }
    return (
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent collisionPadding={4}>
          <p>Record</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  const renderNewSession = () => {
    if (isNewSession) {
      return (
        <div className="flex h-8 min-w-8 items-center justify-center">
          <StarFour size={24} weight="fill" />
        </div>
      );
    }

    return (
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
    );
  };

  const renderScrollToBottom = () => {
    if (showButton && !showPopup) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button onClick={scrollToBottom} variant="secondary" size="iconSm">
            <ArrowDown size={20} weight="bold" />
          </Button>
        </motion.span>
      );
    }
  };

  const renderReplyButton = () => {
    if (showPopup) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={() => {
              setContextValue(selectedText);
              handleClearSelection();
              inputRef.current?.focus();
            }}
            variant="secondary"
            size="sm"
          >
            <Quotes size={20} weight="bold" /> Reply
          </Button>
        </motion.span>
      );
    }
  };

  const renderGreeting = (name: string) => {
    const date = moment();
    const hours = date.get('hour');
    if (hours < 12) return `Good Morning, ${name}.`;
    if (hours < 18) return `Good Afternoon, ${name}.`;
    return `Good Evening, ${name}.`;
  };

  const renderStopButton = () => {
    if (streamingMessage?.loading) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={() => {
              stopGeneration();
            }}
            variant="secondary"
            size="sm"
          >
            <Stop size={20} weight="bold" /> Stop
          </Button>
        </motion.span>
      );
    }
  };

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-t from-70% from-white to-white/10 px-4 pt-16 pb-4 transition-all duration-1000 ease-in-out dark:from-zinc-800 dark:to-transparent',
        isNewSession && 'top-0'
      )}
    >
      {isNewSession && <ChatGreeting />}
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
      </div>

      <div className="flex flex-col gap-1">
        {contextValue && (
          <div className="flex h-10 w-[700px] flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300">
            <Quotes size={16} weight="fill" />
            <p className="ml-2 w-full overflow-hidden truncate text-sm ">
              {contextValue}
            </p>
            <Button
              size={'iconSm'}
              variant="ghost"
              onClick={() => {
                setContextValue('');
              }}
              className="ml-4 flex-shrink-0"
            >
              <X size={16} weight="bold" />
            </Button>
          </div>
        )}
        <motion.div
          variants={slideUpVariant}
          initial={'initial'}
          animate={'animate'}
          className="flex w-[700px] flex-col gap-0 overflow-hidden rounded-[1.25em] bg-white/10"
        >
          <div className="flex h-14 w-full flex-row items-center gap-0 px-3">
            {renderNewSession()}
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
            {renderRecordingControls()}

            <Button
              size="icon"
              variant="ghost"
              className="ml-1 h-8 min-w-8"
              onClick={() => {
                handleRunModel();
              }}
            >
              <ArrowUp size={20} weight="bold" />
            </Button>
          </div>
          <div className="flex w-full flex-row items-center justify-start gap-2 px-2 pt-1 pb-2">
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
          onExampleClick={(prompt) => {
            setInputValue(prompt);
            handleRunModel();
          }}
        />
      )}
    </div>
  );
};
