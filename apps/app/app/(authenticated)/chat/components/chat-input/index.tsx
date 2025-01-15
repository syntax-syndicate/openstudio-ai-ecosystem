import { AudioRecorder } from '@/app/(authenticated)/chat/components/chat-input/audio-recorder';
import { ChatActions } from '@/app/(authenticated)/chat/components/chat-input/chat-actions';
import { ChatEditor } from '@/app/(authenticated)/chat/components/chat-input/chat-editor';
import { ImageAttachment } from '@/app/(authenticated)/chat/components/chat-input/image-attachment';
import { ImageDropzoneRoot } from '@/app/(authenticated)/chat/components/chat-input/image-dropzone-root';
import { ScrollToBottomButton } from '@/app/(authenticated)/chat/components/chat-input/scroll-to-bottom-button';
import { SelectedContext } from '@/app/(authenticated)/chat/components/chat-input/selected-context';
import { StopGenerationButton } from '@/app/(authenticated)/chat/components/chat-input/stop-generation-button';
import { useChatContext, usePreferenceContext } from '@/context';
import { slideUpVariant } from '@/helper/animations';
import { useAssistantUtils, useImageAttachment } from '@/hooks';
import { useChatEditor } from '@/hooks/use-editor';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FlexSpacer } from '@repo/design-system/components/ui/flex-spacer';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export const ChatInput = () => {
  const { store } = useChatContext();
  const { preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();
  const { editor } = useChatEditor();
  const session = store((state) => state.session);
  const context = store((state) => state.context);
  const { attachment, clearAttachment, handleImageUpload, dropzonProps } =
    useImageAttachment();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (session?.id) {
      inputRef.current?.focus();
    }
  }, [session?.id]);

  const sendMessage = (input: string) => {
    const props = getAssistantByKey(preferences.defaultAssistant);
    if (!props || !session) return;
    invokeModel({
      input,
      context,
      image: attachment?.base64,
      sessionId: session.id,
      assistant: props.assistant,
    });
    clearAttachment();
  };
  const chatInputBackgroundContainer = cn(
    'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-end gap-2 px-4 pt-16 pb-4 md:justify-end md:px-4',
    'transition-all duration-1000 ease-in-out'
  );
  const chatContainer = cn(
    'z-10 flex w-full flex-col gap-1 md:w-[640px] lg:w-[700px]'
  );
  return (
    <div className={chatInputBackgroundContainer}>
      <div
        className="absolute right-0 bottom-0 left-0 h-[180px] bg-gradient-to-t from-60% from-white to-transparent backdrop-blur-sm dark:bg-zinc-800/50 dark:from-zinc-800"
        style={{
          maskImage: 'linear-gradient(to top, black 60%, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent)',
        }}
      />
      <div className={chatContainer}>
        <FlexSpacer />
        <Flex items="center" justify="center" gap="sm" className="mb-2">
          <ScrollToBottomButton />
          <StopGenerationButton />
        </Flex>
        <SelectedContext />
        <motion.div
          variants={slideUpVariant}
          initial="initial"
          animate={editor?.isEditable ? 'animate' : 'initial'}
          className="flex w-full flex-shrink-0 overflow-hidden rounded-xl border border-zinc-500/20 bg-white shadow-sm dark:bg-zinc-800"
        >
          <ImageDropzoneRoot dropzoneProps={dropzonProps}>
            <Flex direction="col" className="w-full">
              <ImageAttachment
                attachment={attachment}
                clearAttachment={clearAttachment}
              />
              <Flex className="flex w-full flex-row items-end gap-0 py-2 pr-2 pl-2 md:pl-3">
                <ChatEditor sendMessage={sendMessage} />
                <AudioRecorder sendMessage={sendMessage} />
              </Flex>
            </Flex>
            <ChatActions
              sendMessage={sendMessage}
              handleImageUpload={handleImageUpload}
            />
          </ImageDropzoneRoot>
        </motion.div>
      </div>
    </div>
  );
};
