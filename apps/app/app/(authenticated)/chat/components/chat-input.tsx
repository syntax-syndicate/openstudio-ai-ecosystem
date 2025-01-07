import { ArrowDown02Icon, Navigation03Icon } from '@hugeicons/react';
import { ArrowElbowDownRight, Stop, X } from '@phosphor-icons/react';
import { EditorContent } from '@tiptap/react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-examples';
import { ChatGreeting } from '@/app/(authenticated)/chat/components/chat-greeting';
import { PluginSelect } from '@/app/(authenticated)/chat/components/plugin-select';
import { PromptsBotsCombo } from '@/app/(authenticated)/chat/components/prompts-bots-combo';
import { QuickSettings } from '@/app/(authenticated)/chat/components/quick-settings';
import {
  useAssistantContext,
  useChatContext,
  usePreferenceContext,
  useSessionsContext,
} from '@/app/context';
import {
  defaultPreferences,
  useImageAttachment,
  useModelList,
  useRecordVoice,
  useScrollToBottom,
} from '@/app/hooks';
import type { TAssistant } from '@/app/hooks/use-chat-session';
import { slideUpVariant } from '@/app/lib/framer-motion';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';

export type TAttachment = {
  file?: File;
  base64?: string;
};

export const ChatInput = () => {
  const { sessionId } = useParams();
  const { showButton, scrollToBottom } = useScrollToBottom();
  const {
    renderListeningIndicator,
    renderRecordingControls,
    recording,
    text,
    transcribing,
  } = useRecordVoice();
  const { currentSession } = useSessionsContext();
  const { renderFileUpload, renderAttachedImage, attachment, clearAttachment } =
    useImageAttachment();
  const { selectedAssistant, open: openAssistants } = useAssistantContext();
  const {
    editor,
    handleRunModel,
    openPromptsBotCombo,
    setOpenPromptsBotCombo,
    sendMessage,
    isGenerating,
    contextValue,
    setContextValue,
    stopGeneration,
  } = useChatContext();

  const { preferences, updatePreferences } = usePreferenceContext();
  const { models, getAssistantByKey, getAssistantIcon } = useModelList();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedAssistantKey, setSelectedAssistantKey] = useState<
    TAssistant['key']
  >(preferences.defaultAssistant);

  useEffect(() => {
    const assistantProps = getAssistantByKey(preferences.defaultAssistant);
    if (assistantProps?.model) {
      setSelectedAssistantKey(preferences.defaultAssistant);
    } else {
      updatePreferences({
        defaultAssistant: defaultPreferences.defaultAssistant,
      });
    }
  }, [models, preferences]);

  useEffect(() => {
    if (editor?.isActive) {
      editor.commands.focus('end');
    }
  }, [editor?.isActive]);

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isFreshSession = !currentSession?.messages?.length;

  useEffect(() => {
    if (text) {
      editor?.commands.clearContent();
      editor?.commands.setContent(text);
      const props = getAssistantByKey(preferences.defaultAssistant);
      if (!props) {
        return;
      }
      handleRunModel({
        input: text,
        image: attachment?.base64,
        sessionId: sessionId!.toString(),
        assistant: props.assistant,
      });
      clearAttachment();

      editor?.commands.clearContent();
    }
  }, [text]);

  const renderScrollToBottom = () => {
    if (showButton && !recording && !transcribing) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            onClick={scrollToBottom}
            className="dark:border dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            size="iconSm"
            variant="outline"
            rounded="full"
          >
            <ArrowDown02Icon size={16} strokeWidth="2" />
          </Button>
        </motion.span>
      );
    }
  };

  const renderStopGeneration = () => {
    if (isGenerating) {
      return (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Button
            rounded="full"
            size="sm"
            className="dark:border dark:border-white/10 dark:bg-zinc-800 dark:text-white"
            onClick={() => {
              stopGeneration();
            }}
          >
            <Stop size={16} weight="fill" />
            Stop generation
          </Button>
        </motion.span>
      );
    }
  };

  //   if (showPopup && !recording && !transcribing) {
  //     return (
  //       <motion.span
  //         initial={{ scale: 0, opacity: 0 }}
  //         animate={{ scale: 1, opacity: 1 }}
  //         exit={{ scale: 0, opacity: 0 }}
  //       >
  //         <Button
  //           onClick={() => {
  //             setContextValue(selectedText);
  //             handleClearSelection();
  //             inputRef.current?.focus();
  //           }}
  //           variant="secondary"
  //           size="sm"
  //         >
  //           <Quotes size={20} weight="bold" /> Reply
  //         </Button>
  //       </motion.span>
  //     );
  //   }
  // };

  const renderSelectedContext = () => {
    if (contextValue) {
      return (
        <div className="flex w-full flex-row items-start justify-start gap-2 rounded-xl border border-zinc-100 bg-white py-2 pr-2 pl-2 text-zinc-700 ring-1 ring-zinc-100 md:w-[700px] lg:w-[720px] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700">
          <ArrowElbowDownRight size={16} weight="bold" className="mt-1" />
          <p className="ml-2 line-clamp-2 w-full overflow-hidden text-sm md:text-base">
            {contextValue}
          </p>
          <Button
            size={'iconXS'}
            variant="ghost"
            onClick={() => {
              setContextValue('');
            }}
            className="ml-4 flex-shrink-0"
          >
            <X size={14} weight="bold" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 flex w-full flex-col items-center justify-end gap-2 px-2 pt-16 pb-4 md:justify-center md:px-4',
        'left-0 bg-gradient-to-t from-70% from-white to-transparent transition-all duration-1000 ease-in-out dark:from-zinc-800',
        isFreshSession && 'top-0'
      )}
    >
      {isFreshSession && <ChatGreeting />}
      <div className="mb-2 flex flex-row items-center justify-center gap-2">
        {renderScrollToBottom()}
        {renderStopGeneration()}
        {renderListeningIndicator()}
      </div>
      <div className="flex w-full flex-col gap-3 md:w-[700px] lg:w-[720px]">
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
          >
            <motion.div
              variants={slideUpVariant}
              initial={'initial'}
              animate={editor.isEditable ? 'animate' : 'initial'}
              className="flex w-full flex-col items-start gap-0 overflow-hidden rounded-2xl bg-zinc-50 ring-zinc-100 ring-offset-2 focus-within:ring-2 dark:border-white/5 dark:bg-white/5 dark:ring-zinc-700 dark:ring-offset-zinc-800"
            >
              <div className="flex w-full flex-col items-start justify-start">
                {attachment && (
                  <div className="pt-2 pr-2 pl-2 md:pl-3">
                    {renderAttachedImage()}
                  </div>
                )}
                <div className="flex w-full flex-row items-end gap-0 py-2 pr-2 pl-2 md:pl-3">
                  <EditorContent
                    editor={editor}
                    autoFocus
                    onKeyDown={(e) => {
                      console.log('keydown', e.key);
                      if (e.key === 'Enter' && !e.shiftKey) {
                        sendMessage(attachment?.base64);
                        clearAttachment();
                      }
                    }}
                    className="no-scrollbar [&>*]:no-scrollbar wysiwyg max-h-[120px] min-h-8 w-full cursor-text overflow-y-auto p-1 text-sm outline-none focus:outline-none md:text-base [&>*]:leading-6 [&>*]:outline-none"
                  />

                  {!isGenerating && renderRecordingControls()}
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-start gap-0 px-2 pt-1 pb-2">
                <Button
                  variant={'ghost'}
                  onClick={openAssistants}
                  className={cn('gap-2 pr-3 pl-1 text-xs md:text-sm')}
                  size="sm"
                >
                  {selectedAssistant?.assistant.key &&
                    getAssistantIcon(selectedAssistant?.assistant.key)}
                  {selectedAssistant?.assistant.name}
                </Button>
                <PluginSelect selectedAssistantKey={selectedAssistantKey} />
                {renderFileUpload()}
                <QuickSettings />
                <div className="flex-1"></div>

                {!isGenerating && (
                  <Button
                    size="iconSm"
                    rounded="full"
                    variant={!!editor?.getText() ? 'default' : 'secondary'}
                    disabled={!editor?.getText()}
                    className={cn(
                      !!editor?.getText() &&
                        'bg-zinc-800 text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:outline-emerald-400'
                    )}
                    onClick={() => {
                      sendMessage(attachment?.base64);
                      clearAttachment();
                    }}
                  >
                    <Navigation03Icon
                      size={18}
                      variant="stroke"
                      strokeWidth="2"
                    />
                  </Button>
                )}
              </div>
            </motion.div>
          </PromptsBotsCombo>
        )}
      </div>
      {isFreshSession && <ChatExamples />}
    </div>
  );
};
