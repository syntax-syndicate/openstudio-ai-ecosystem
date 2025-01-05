import { useFilters } from '@/app/context/filters/context';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { useRecordVoice } from '@/app/hooks/use-record-voice';
import useScrollToBottom from '@/app/hooks/use-scroll-to-bottom';
import { useTextSelection } from '@/app/hooks/use-text-selection';
import { slideUpVariant } from '@/app/lib/framer-motion';
import { cn } from '@repo/design-system/lib/utils';

import {
  ArrowDown,
  ArrowElbowDownRight,
  ArrowUp,
  Command,
  Quotes,
  X,
} from '@phosphor-icons/react';

import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { Badge } from '@repo/design-system/components/ui/badge';
import { EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-examples';
import { Footer } from '@/app/(authenticated)/chat/components/footer';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { PromptsBotsCombo } from '@/app/(authenticated)/chat/components/prompts-bots-combo';
import { QuickSettings } from '@/app/(authenticated)/chat/components/quick-settings';
import { useChatContext } from '@/app/context/chat/provider';
import { usePreferenceContext } from '@/app/context/preferences/provider';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { useModelList } from '@/app/hooks/use-model-list';
import { Button } from '@repo/design-system/components/ui/button';

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { open: openFilters } = useFilters();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const {
    renderListeningIndicator,
    renderRecordingControls,
    recording,
    text,
    transcribing,
  } = useRecordVoice();
  const { currentSession } = useSessionsContext();
  const {
    editor,
    handleRunModel,
    openPromptsBotCombo,
    setOpenPromptsBotCombo,
    sendMessage,
  } = useChatContext();
  const [contextValue, setContextValue] = useState<string>('');

  const { preferences } = usePreferenceContext();
  const { models } = useModelList();
  const { showPopup, selectedText, handleClearSelection } = useTextSelection();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedModel, setSelectedModel] = useState<TModelKey>(
    preferences.defaultModel
  );

  useEffect(() => {
    setSelectedModel(preferences.defaultModel);
  }, [models, preferences]);

  console.log('selectedModelinput', preferences.defaultModel);

  useEffect(() => {
    if (editor?.isActive) {
      editor.commands.focus('end');
    }
  }, [editor?.isActive]);

  // useEffect(() => {
  //   if (currentSession?.bot?.deafultBaseModel) {
  //     setSelectedModel(currentSession.bot.deafultBaseModel);
  //   }
  // }, [currentSession]);

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
      handleRunModel({
        input: text,
        sessionId: sessionId!.toString(),
      });

      editor?.commands.clearContent();
    }
  }, [text]);

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

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-end gap-1 bg-gradient-to-t from-70% from-white to-transparent px-2 pt-16 pb-2 transition-all duration-1000 ease-in-out md:justify-center md:px-4 dark:from-zinc-800',
        isFreshSession && 'top-0'
      )}
    >
      <ChatExamples onExampleClick={(prompt) => {}} show={false} />
      <div className="flex flex-row items-center gap-2">
        {renderScrollToBottom()}
        {renderReplyButton()}
        {renderListeningIndicator()}
      </div>

      <div className="flex w-full flex-col gap-1 md:w-[700px] lg:w-[720px]">
        {renderSelectedContext()}
        {editor && (
          <PromptsBotsCombo
            open={openPromptsBotCombo}
            onBack={() => {
              editor?.commands.clearContent();
              editor?.commands.focus('end');
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
                    if (e.key === 'Enter') {
                      e.preventDefault();
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
                  <Badge className="flex">
                    <Command size={16} weight="bold" /> K
                  </Badge>
                </Button>
              </div>
            </motion.div>
          </PromptsBotsCombo>
        )}

        <Footer />
      </div>
    </div>
  );
};
