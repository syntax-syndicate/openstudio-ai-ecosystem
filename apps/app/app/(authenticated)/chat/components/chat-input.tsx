import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-examples';
import { ChatGreeting } from '@/app/(authenticated)/chat/components/chat-greeting';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { useSettings } from '@/app/context/settings/context';
import { useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { slideUpVariant } from '@/app/lib/framer-motion';
import { PromptType, RoleType } from '@/app/lib/prompts';
import { examplePrompts } from '@/app/lib/prompts';
import {
  ArrowElbowDownRight,
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Paperclip,
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
import {
  Command as CMDKCommand,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@repo/design-system/components/ui/popover';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'sonner';

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const router = useRouter();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
  const { runModel, createSession, currentSession, streaming, stopGeneration } =
    useChatContext();
  const [inputValue, setInputValue] = useState('');
  const [contextValue, setContextValue] = useState<string>('');
  const { getPreferences, getApiKey } = usePreferences();
  const { getModelByKey } = useModelList();
  const { open: openSettings } = useSettings();
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const [attachment, setAttachment] = useState<TAttachment>();

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        'JPEG',
        100,
        0,
        (uri) => {
          console.log(typeof uri);
          resolve(uri);
        },
        'file'
      );
    });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    const reader = new FileReader();

    const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (file && !fileTypes.includes(file?.type)) {
      toast('Please select a valid image (JPEG, PNG, GIF).');
      return;
    }

    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const base64String = reader?.result?.split(',')[1];
      setAttachment((prev) => ({
        ...prev,
        base64: `data:${file?.type};base64,${base64String}`,
      }));
    };

    if (file) {
      setAttachment((prev) => ({
        ...prev,
        file,
      }));
      const resizedFile = await resizeFile(file);

      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleRunModel = (query?: string) => {
    if (!query && !inputValue) {
      return;
    }
    getPreferences().then(async (preference) => {
      const selectedModel = getModelByKey(preference.defaultModel);

      if (
        selectedModel?.key &&
        !['gpt-4-turbo', 'gpt-4o'].includes(selectedModel?.key) &&
        attachment?.base64
      ) {
        toast.error('This model does not support image input.');
        return;
      }

      console.log(selectedModel?.baseModel);
      if (!selectedModel?.baseModel) {
        throw new Error('Model not found');
      }

      const apiKey = await getApiKey(selectedModel?.baseModel);
      console.log(apiKey);

      if (!apiKey) {
        toast.error('API key is missing. Please check your settings.');
        openSettings(selectedModel?.baseModel);
        return;
      }
      console.log(inputValue);
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          image: attachment?.base64,
          query: query || inputValue,
          context: contextValue,
        },
        sessionId!.toString()
      );
      setAttachment(undefined);
      setContextValue('');
      setInputValue('');
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const keyCode = e?.which || e?.keyCode;

    if (keyCode === 13 && !e.shiftKey) {
      // Don't generate a new line
      e.preventDefault();
      handleRunModel();
    }
  };

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isNewSession = !currentSession?.messages?.length;

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
        <>
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
        </>
      );
    }

    return (
      <Tooltip content="Record">
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
      </Tooltip>
    );
  };

  const renderNewSession = () => {
    if (isNewSession) {
      return (
        <div className="flex h-8 min-w-8 items-center justify-center text-zinc-500 dark:text-white">
          <StarFour size={20} weight="fill" />
        </div>
      );
    }

    return (
      <Tooltip content="New Session">
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
      </Tooltip>
    );
  };

  const renderListeningIndicator = () => {
    if (transcribing) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-4 py-1 text-sm text-white dark:bg-zinc-900">
          <AudioWaveSpinner /> <p>Transcribing ...</p>
        </div>
      );
    }
    if (recording) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-2 py-1 pr-4 text-sm text-white dark:bg-zinc-900">
          <AudioWaveSpinner />
          <p>Listening ...</p>
        </div>
      );
    }
  };

  const renderScrollToBottom = () => {
    if (showButton && !showPopup && !recording && !transcribing) {
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
    if (showPopup && !recording && !transcribing) {
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

  const renderStopButton = () => {
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
  };

  const renderAttachedImage = () => {
    if (attachment?.base64 && attachment?.file) {
      return (
        <div className="flex h-10 w-[700px] flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300">
          <ArrowElbowDownRight size={20} weight="bold" />
          <p className="relative ml-2 flex w-full flex-row items-center gap-2 text-xs">
            <Image
              src={attachment.base64}
              alt="uploaded image"
              className="tanslate-y-[50%] absolute h-[60px] min-w-[60px] rotate-6 rounded-xl border border-white/5 object-cover shadow-md"
              width={0}
              height={0}
            />
            <span className="ml-[70px]">{attachment?.file?.name}</span>
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
      );
    }
  };

  const renderSelectedContext = () => {
    if (contextValue) {
      return (
        <div className="flex h-10 w-[700px] flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300">
          <ArrowElbowDownRight size={16} weight="fill" />
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
      );
    }
  };

  const renderFileUpload = () => {
    return (
      <>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleImageUpload}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFileSelect}
          className="px-1.5"
        >
          <Paperclip size={16} weight="bold" /> Attach
        </Button>
      </>
    );
  };
  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-center gap-2 bg-gradient-to-t from-70% from-zinc-50 to-transparent px-4 pt-16 pb-4 transition-all duration-1000 ease-in-out dark:from-zinc-800',
        isNewSession && 'top-0'
      )}
    >
      {isNewSession && <ChatGreeting />}
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
        {renderListeningIndicator()}
      </div>

      <div className="flex flex-col gap-1">
        {renderSelectedContext()}
        {renderAttachedImage()}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor>
            <motion.div
              variants={slideUpVariant}
              initial={'initial'}
              animate={'animate'}
              className="flex w-[700px] flex-col gap-0 overflow-hidden rounded-[1.25em] border border-black/10 bg-white shadow-sm dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex min-h-14 w-full flex-row items-start gap-0 px-3 pt-3">
                {renderNewSession()}
                <TextareaAutosize
                  minRows={1}
                  maxRows={6}
                  value={inputValue}
                  autoComplete="off"
                  autoCapitalize="off"
                  placeholder="Ask AI anything ..."
                  defaultValue="Just a single line..."
                  onChange={(e) => {
                    if (e.target.value === '/') {
                      setOpen(true);
                    }
                    setInputValue(e.currentTarget.value);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full resize-none border-none bg-transparent px-2 py-1.5 text-sm leading-5 tracking-[0.01em] outline-none "
                />

                {renderRecordingControls()}

                <Button
                  size="icon"
                  variant={!!inputValue ? 'secondary' : 'ghost'}
                  disabled={!inputValue}
                  className="ml-1 h-8 min-w-8"
                  onClick={() => handleRunModel()}
                >
                  <ArrowUp size={20} weight="bold" />
                </Button>
              </div>
              <div className="flex w-full flex-row items-center justify-start gap-2 px-2 pt-1 pb-2">
                <ModelSelect />

                <div className="flex-1"></div>

                <Button
                  variant="ghost"
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
          </PopoverAnchor>
          <PopoverContent className="w-[700px] overflow-hidden rounded-2xl p-0">
            <CMDKCommand>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandList className="p-1">
                {examplePrompts?.map((example, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      setInputValue(example.prompt);
                      inputRef.current?.focus();
                      setOpen(false);
                    }}
                  >
                    {example.title}
                  </CommandItem>
                ))}
              </CommandList>
            </CMDKCommand>
          </PopoverContent>
        </Popover>
      </div>
      <ChatExamples
        show={isNewSession}
        onExampleClick={(prompt) => {
          handleRunModel(prompt);
        }}
      />
    </div>
  );
};
