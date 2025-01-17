import { ChangeLogs } from '@/app/(authenticated)/chat/components/changelogs';
import { AudioRecorder } from '@/app/(authenticated)/chat/components/chat-input/audio-recorder';
import { ChatActions } from '@/app/(authenticated)/chat/components/chat-input/chat-actions';
import { ChatEditor } from '@/app/(authenticated)/chat/components/chat-input/chat-editor';
import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-input/chat-examples';
import { ImageAttachment } from '@/app/(authenticated)/chat/components/chat-input/image-attachment';
import { ImageDropzoneRoot } from '@/app/(authenticated)/chat/components/chat-input/image-dropzone-root';
import { ScrollToBottomButton } from '@/app/(authenticated)/chat/components/chat-input/scroll-to-bottom-button';
import { SelectedContext } from '@/app/(authenticated)/chat/components/chat-input/selected-context';
import { StopGenerationButton } from '@/app/(authenticated)/chat/components/chat-input/stop-generation-button';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { WelcomeMessage } from '@/app/(authenticated)/chat/components/welcome-message';
import { useChatContext, usePreferenceContext } from '@/context';
import { slideUpVariant } from '@/helper/animations';
import { useAssistantUtils, useImageAttachment } from '@/hooks';
import { useChatEditor } from '@/hooks/use-editor';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import GitHubButton from 'react-github-btn';

export const ChatInput = () => {
  const { store } = useChatContext();
  const [openChangelog, setOpenChangelog] = useState(false);
  const { preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();
  const { editor } = useChatEditor();
  const session = store((state) => state.session);
  const messages = store((state) => state.messages);
  const currentMessage = store((state) => state.currentMessage);
  const context = store((state) => state.context);
  const { attachment, clearAttachment, handleImageUpload, dropzonProps } =
    useImageAttachment();

  const isFreshSession = messages.length === 0 && !currentMessage?.id;

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
    'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-end gap-2 px-4 pt-16 pb-3 md:justify-end md:px-4',
    'transition-all duration-1000 ease-in-out',
    isFreshSession && 'top-0 md:justify-center'
  );

  const chatContainer = cn(
    'z-10 flex w-full flex-col items-center gap-1 md:w-[640px] lg:w-[700px]'
  );

  return (
    <div className={chatInputBackgroundContainer}>
      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 h-[180px] bg-gradient-to-t from-60% from-white to-transparent backdrop-blur-sm dark:bg-zinc-800/50 dark:from-zinc-800',
          isFreshSession &&
            'top-0 flex h-full flex-col items-center justify-center'
        )}
        style={{
          maskImage: 'linear-gradient(to top, black 60%, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent)',
        }}
      />

      <div className={chatContainer}>
        {isFreshSession && (
          <Flex
            items="center"
            justify="center"
            direction="col"
            gap="md"
            className="mb-4"
          >
            <Badge
              onClick={() => setOpenChangelog(true)}
              className="cursor-pointer gap-1"
              variant="tertiary"
            >
              <Flame size={14} /> Now supports charts!!
            </Badge>

            <ChangeLogs open={openChangelog} setOpen={setOpenChangelog} />

            <ModelIcon type="chathub" size="lg" rounded={false} />
            <Type size="lg" textColor="secondary">
              How can I help you?
            </Type>
          </Flex>
        )}

        <Flex items="center" justify="center" gap="sm" className="mb-2">
          <ScrollToBottomButton />
          <StopGenerationButton />
        </Flex>
        <SelectedContext />
        <Flex direction="col" className="w-full rounded-xl bg-zinc-500/10">
          <Flex className="w-full px-3 py-2">
            <Type size="xs" textColor="secondary">
              OpenStudio ChatHub is available at zero cost, with daily usage
              caps.
            </Type>
          </Flex>
          <motion.div
            variants={slideUpVariant}
            initial="initial"
            animate={editor?.isEditable ? 'animate' : 'initial'}
            className="flex w-full flex-shrink-0 overflow-hidden rounded-xl border border-zinc-500/25 bg-white shadow-sm dark:bg-zinc-700/50"
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
        </Flex>
        {!isFreshSession && (
          <Type size="xxs" textColor="tertiary" className="pb-1">
            AI responses may not always be accurate.
          </Type>
        )}
        {isFreshSession && <ChatExamples />}
        {isFreshSession && <WelcomeMessage />}
      </div>
      {isFreshSession && (
        <Type
          size="xxs"
          textColor="tertiary"
          className="absolute bottom-0 z-10 py-2"
        >
          OpenStudio ChatHub is open source{' '}
          <span className="inline-block px-1">
            <GitHubButton
              href="https://github.com/kuluruvineeth/openstudio-beta"
              data-color-scheme="no-preference: light; light: light; dark: dark;"
              data-show-count="true"
              aria-label="Star kuluruvineeth/openstudio-beta on GitHub"
            >
              Star
            </GitHubButton>{' '}
          </span>
        </Type>
      )}
    </div>
  );
};
