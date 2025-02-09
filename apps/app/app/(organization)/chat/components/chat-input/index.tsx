import { ChangeLogs } from '@/app/(organization)/chat/components/changelogs';
import { ApiKeyStatus } from '@/app/(organization)/chat/components/chat-input/api-key-status';
import { ChatActions } from '@/app/(organization)/chat/components/chat-input/chat-actions';
import { ChatEditor } from '@/app/(organization)/chat/components/chat-input/chat-editor';
import { ChatFooter } from '@/app/(organization)/chat/components/chat-input/chat-footer';
import { ImageAttachment } from '@/app/(organization)/chat/components/chat-input/image-attachment';
import { ImageDropzoneRoot } from '@/app/(organization)/chat/components/chat-input/image-dropzone-root';
import { ScrollToBottomButton } from '@/app/(organization)/chat/components/chat-input/scroll-to-bottom-button';
import { SelectedContext } from '@/app/(organization)/chat/components/chat-input/selected-context';
import { StarterMessages } from '@/app/(organization)/chat/components/chat-input/starter-messages';
import { CustomAssistantAvatar } from '@/app/(organization)/chat/components/custom-assistant-avatar';
import { examplePrompts } from '@/config';
import { useChatContext, usePreferenceContext, useSessions } from '@/context';
import { useRootContext } from '@/context/root';
import { env } from '@/env';
import { slideUpVariant } from '@/helper/animations';
import { useAssistantUtils, useImageAttachment } from '@/hooks';
import { useChatEditor } from '@/hooks/use-editor';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import { usePremium } from '@/hooks/use-premium';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FullPageLoader } from '@repo/design-system/components/ui/full-page-loader';
import { Type } from '@repo/design-system/components/ui/text';
import { toast } from '@repo/design-system/hooks/use-toast';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const ChatInput = () => {
  const { store, isReady, refetch } = useChatContext();
  const { removeAssistantFromSessionMutation } = useSessions();
  const [openChangelog, setOpenChangelog] = useState(false);
  const { preferences, isPreferencesReady } = usePreferenceContext();
  const { getAssistantByKey, getAssistantIcon } = useAssistantUtils();
  const { isPremium, messagesCountPerMonth, premium } = usePremium();
  const { setOpenPricingModal, setOpenMessageLimitModal } = useRootContext();
  const { invokeModel } = useLLMRunner();
  const { editor } = useChatEditor();
  const currentMessage = store((state) => state.currentMessage);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const session = store((state) => state.session);
  const isInitialized = store((state) => state.isInitialized);
  const setIsInitialized = store((state) => state.setIsInitialized);
  const context = store((state) => state.context);
  const { attachment, clearAttachment, handleImageUpload, dropzonProps } =
    useImageAttachment();
  const isFreshSession = !isInitialized;

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (session?.id) {
      inputRef.current?.focus();
    }
  }, [session?.id]);

  // const sendMessage = (input: string) => {
  //   if (!isReady) return;
  //   const props = getAssistantByKey(preferences.defaultAssistant);
  //   if (!props || !session) return;
  //   setIsInitialized(true);
  //   editor?.commands.clearContent();
  //   invokeModel({
  //     input,
  //     context,
  //     image: attachment?.base64,
  //     sessionId: session.id,
  //     assistant: props.assistant,
  //   });
  //   clearAttachment();
  // };

  const sendMessage = (input: string) => {
    if (!isReady) return;

    // Get all default assistants from preferences
    const assistants = preferences.defaultAssistants
      ? preferences.defaultAssistants
          .map((key) => getAssistantByKey(key))
          .filter(Boolean)
      : [preferences.defaultAssistant];

    let messageLimitPerMonth = 0;
    if (!premium || !premium.tier) {
      messageLimitPerMonth = env.NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT;
    } else {
      messageLimitPerMonth =
        premium!.tier === 'LIFETIME'
          ? env.NEXT_PUBLIC_LIFETIME_USERS_MESSAGE_LIMIT
          : premium!.tier === 'PRO_MONTHLY' || premium!.tier === 'PRO_ANNUALLY'
            ? env.NEXT_PUBLIC_PRO_USERS_MESSAGE_LIMIT
            : env.NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT;
    }

    if (!isPremium && messagesCountPerMonth! >= messageLimitPerMonth) {
      setOpenMessageLimitModal(true);
      toast({
        title: 'Error',
        description:
          'You have reached the message limit for this month. Upgrade to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (!assistants.length || !session) return;

    setIsInitialized(true);
    editor?.commands.clearContent();

    // Invoke model for each assistant in parallel
    assistants.forEach((assistantProps) => {
      invokeModel({
        input,
        context,
        image: attachment?.base64,
        sessionId: session.id,
        // @ts-ignore
        assistant: assistantProps!.assistant!,
      });
    });

    clearAttachment();
  };

  const chatInputBackgroundContainer = cn(
    'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-end gap-2 px-4 pb-1 md:px-4',
    'transition-all duration-1000 ease-in-out',
    isFreshSession && 'top-0 justify-center '
  );

  const chatContainer = cn(
    'z-10 flex w-full flex-1 flex-col items-center gap-1 md:w-[640px] lg:w-[700px]'
  );

  const renderChatBottom = () => {
    return (
      <>
        {isFreshSession && (
          <StarterMessages
            messages={
              session?.customAssistant?.startMessage?.map((m) => ({
                name: m,
                content: m,
              })) || examplePrompts
            }
          />
        )}
        <Flex items="center" justify="center" gap="sm" className="mb-2">
          <ScrollToBottomButton />
        </Flex>
        <SelectedContext />
        <Flex
          direction="col"
          className="w-full rounded-lg border border-zinc-500/15 bg-white shadow-sm dark:bg-zinc-700"
        >
          <motion.div
            variants={slideUpVariant}
            initial="initial"
            animate={editor?.isEditable ? 'animate' : 'initial'}
            className="flex w-full flex-shrink-0 overflow-hidden rounded-xl"
          >
            <ImageDropzoneRoot dropzoneProps={dropzonProps}>
              <Flex direction="col" className="w-full">
                <ImageAttachment
                  attachment={attachment}
                  clearAttachment={clearAttachment}
                />
                <Flex className="flex w-full flex-row items-end gap-0 py-2 pr-2 pl-2 md:pl-3">
                  <ChatEditor sendMessage={sendMessage} editor={editor} />
                </Flex>
                <ChatActions
                  sendMessage={sendMessage}
                  handleImageUpload={handleImageUpload}
                />
              </Flex>
            </ImageDropzoneRoot>
          </motion.div>
        </Flex>
        {<ChatFooter />}
      </>
    );
  };

  if (!isReady || !isPreferencesReady)
    return (
      <div className={chatInputBackgroundContainer}>
        <FullPageLoader label="Initializing chat" />
      </div>
    );

  return (
    <div className={chatInputBackgroundContainer}>
      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 h-[120px] bg-gradient-to-t from-40% from-zinc-25 to-transparent dark:bg-zinc-800/50 dark:from-zinc-800',
          isFreshSession &&
            'top-0 flex h-full flex-col items-center justify-center'
        )}
      />

      <div className={chatContainer}>
        {isFreshSession && (
          <Flex
            items="center"
            justify="center"
            direction="col"
            gap="md"
            className="mb-2 flex-1"
          >
            <Badge
              onClick={() => setOpenChangelog(true)}
              className="cursor-pointer gap-1"
              variant="tertiary"
            >
              <Flame size={14} /> What&apos;s new
            </Badge>

            <ChangeLogs open={openChangelog} setOpen={setOpenChangelog} />

            {session?.customAssistant ? (
              <CustomAssistantAvatar
                url={session?.customAssistant?.iconURL}
                alt={session?.customAssistant?.name}
                size="lg"
              />
            ) : (
              getAssistantIcon(
                preferences.defaultAssistants?.[0] ??
                  preferences.defaultAssistant,
                'lg',
                true
              )
            )}
            <Flex direction="col" gap="xs" justify="center" items="center">
              <Type
                size="lg"
                textColor={session?.customAssistant ? 'primary' : 'secondary'}
              >
                {session?.customAssistant
                  ? session?.customAssistant?.name
                  : 'How can I help you?'}
              </Type>
              {session?.customAssistant && (
                <Type size="sm" textColor="secondary">
                  {session?.customAssistant?.description}
                </Type>
              )}
              {session?.customAssistant && (
                <Type
                  size="sm"
                  textColor="secondary"
                  className="max-w-[400px] text-center"
                >
                  {session?.customAssistant?.description}
                </Type>
              )}
              {session?.customAssistant && (
                <Button
                  variant="bordered"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    removeAssistantFromSessionMutation.mutate(session?.id, {
                      onSuccess: () => {
                        refetch();
                      },
                    });
                  }}
                >
                  Remove
                </Button>
              )}
            </Flex>
            {!isPremium && <ApiKeyStatus />}
          </Flex>
        )}
        {renderChatBottom()}
      </div>
    </div>
  );
};
