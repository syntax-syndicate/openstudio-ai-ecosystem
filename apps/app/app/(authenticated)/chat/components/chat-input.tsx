import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { QuickSettings } from '@/app/(authenticated)/chat/components/quick-settings';
import { useChatContext } from '@/app/context/chat/context';
import { useFilters } from '@/app/context/filters/context';
import { useSettings } from '@/app/context/settings/context';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { slideUpVariant } from '@/app/lib/framer-motion';
import {
  ArrowElbowDownRight,
  ArrowUp,
  ClockClockwise,
  Command,
  Microphone,
  Paperclip,
  Quotes,
  Stop,
  StopCircle,
  X,
} from '@phosphor-icons/react';
import { ArrowDown } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { cn } from '@repo/design-system/lib/utils';

import { Footer } from '@/app/(authenticated)/chat/components/footer';
import { PromptsBotsCombo } from '@/app/(authenticated)/chat/components/prompts-bots-combo';
import { EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import Resizer from 'react-image-file-resizer';

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const { toast } = useToast();
  const { startRecording, stopRecording, recording, text, transcribing } =
    useRecordVoice();
  const {
    currentSession,
    stopGeneration,
    editor,
    handleRunModel,
    openPromptsBotCombo,
    setOpenPromptsBotCombo,
    sendMessage,
  } = useChatContext();
  const [contextValue, setContextValue] = useState<string>('');
  const { getApiKey } = usePreferences();
  const { open: openSettings } = useSettings();

  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] = useState<TModelKey>('gpt-4-turbo');

  const [attachment, setAttachment] = useState<TAttachment>();

  useEffect(() => {
    if (editor?.isActive) {
      editor.commands.focus('end');
    }
  }, [editor?.isActive]);

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
      toast({
        title: 'Invalid format',
        description: 'Please select a valid image (JPEG, PNG, GIF).',
        variant: 'destructive',
      });
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

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isFreshSession =
    !currentSession?.messages?.length && !currentSession?.bot;

  useEffect(() => {
    if (text) {
      editor?.commands.clearContent();
      editor?.commands.setContent(text);
      console.log('Voice run', sessionId!.toString());
      handleRunModel({
        input: text,
        sessionId: sessionId!.toString(),
      });

      editor?.commands.clearContent();
    }
  }, [text]);

  const startVoiceRecording = async () => {
    const apiKey = await getApiKey('openai');
    if (!apiKey) {
      toast({
        title: 'API key missing',
        description:
          'Recordings require OpenAI API key. Please check settings.',
        variant: 'destructive',
      });
      openSettings('openai');
      return;
    }
    startRecording();
  };

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
          onClick={startVoiceRecording}
        >
          <Microphone size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  const renderListeningIndicator = () => {
    if (transcribing) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-4 py-1 text-sm text-white md:text-base dark:bg-zinc-900">
          <AudioWaveSpinner /> <p>Transcribing ...</p>
        </div>
      );
    }
    if (recording) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-2 py-1 pr-4 text-sm text-white md:text-base dark:bg-zinc-900">
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
        <div className="flex h-10 w-full flex-row items-center justify-start gap-2 rounded-xl bg-black/30 pr-1 pl-3 text-zinc-300 md:w-[700px]">
          <ArrowElbowDownRight size={20} weight="bold" />
          <p className="relative ml-2 flex w-full flex-row items-center gap-2 text-sm md:text-base">
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
          <p className="ml-2 w-full overflow-hidden truncate text-sm md:text-base ">
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

  const clearInput = () => {
    editor?.commands.clearContent();
  };

  const focusToInput = () => {
    editor?.commands.focus('end');
  };

  return (
    <div
      className={cn(
        'absolute right-0 bottom-8 left-0 flex w-full flex-col items-center justify-end gap-1 bg-gradient-to-t from-70% from-white to-transparent px-2 pt-16 pb-4 transition-all duration-1000 ease-in-out md:bottom-0 md:justify-center md:px-4 dark:from-zinc-800',
        isFreshSession && 'top-0'
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
        {renderListeningIndicator()}
      </div>

      <div className="flex w-full flex-col gap-1 md:w-[700px]">
        {renderSelectedContext()}
        {renderAttachedImage()}
        {editor && (
          <PromptsBotsCombo
            open={openPromptsBotCombo}
            onBack={() => {
              clearInput();
              focusToInput();
            }}
            onPromptSelect={(prompt) => {
              editor?.commands.setContent(prompt.content);
              editor?.commands.insertContent('');
              editor?.commands.focus('end');
              setOpenPromptsBotCombo(false);
            }}
            onOpenChange={setOpenPromptsBotCombo}
            onBotSelect={(bot) => {
              editor?.commands?.clearContent();
              editor?.commands.focus('end');
            }}
          >
            <motion.div
              variants={slideUpVariant}
              initial={'initial'}
              animate={editor.isEditable ? 'animate' : 'initial'}
              className="flex w-full flex-col items-start gap-0 overflow-hidden rounded-2xl bg-zinc-50 dark:border-white/5 dark:bg-white/5"
            >
              <div className="flex w-full flex-row items-end gap-0 py-2 pr-2 pl-2 md:pl-3">
                <EditorContent
                  editor={editor}
                  autoFocus
                  onKeyDown={(e) => {
                    console.log('keydown', e.key);
                    if (e.key === 'Enter' && !e.shiftKey) {
                      sendMessage();
                    }
                  }}
                  className="no-scrollbar [&>*]:no-scrollbar wysiwyg max-h-[120px] min-h-8 w-full cursor-text overflow-y-auto p-1 text-sm outline-none focus:outline-none md:text-base [&>*]:leading-6 [&>*]:outline-none"
                />

                {renderRecordingControls()}

                <Button
                  size="icon"
                  variant={!!editor?.getText() ? 'secondary' : 'ghost'}
                  disabled={!editor?.getText()}
                  className="ml-1 h-8 min-w-8"
                  onClick={() => {
                    sendMessage();
                  }}
                >
                  <ArrowUp size={20} weight="bold" />
                </Button>
              </div>
              <div className="flex w-full flex-row items-center justify-start gap-0 px-2 pt-1 pb-2">
                <ModelSelect
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                />
                <PluginSelect selectedModel={selectedModel} />
                <QuickSettings />
                <div className="flex-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openFilters}
                  className="px-1.5"
                >
                  <ClockClockwise size={16} weight="bold" /> History
                  <Badge className="hidden md:flex">
                    <Command size={16} weight="bold" /> K
                  </Badge>
                </Button>
              </div>
            </motion.div>
          </PromptsBotsCombo>
        )}

        <Footer show={isFreshSession} />
      </div>
    </div>
  );
};
