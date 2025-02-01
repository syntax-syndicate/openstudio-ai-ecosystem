import { ChatScrollAnchor } from '@/app/(organization)/chat/components/chat-scroll-anchor';
import { Message } from '@/app/(organization)/chat/components/messages/message';
import { useChatContext, useSessions } from '@/context';
import { useRelatedQuestions } from '@/hooks/use-related-questions';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { useTitleGenerator } from '@/hooks/use-title-generator';
import { useEffect } from 'react';

interface RecentMessageProps {
  assistantKey?: string; // Optional for backward compatibility
}

export const RecentMessage = ({ assistantKey }: RecentMessageProps) => {
  const { store } = useChatContext();
  const currentMessage = store((state) => state.currentMessage);
  const isGenerating = store((state) => state.isGenerating);
  //   const prevMessagesIds = store((state) =>
  //     state.messages.map((message) => message.id),
  //   );
  const setIsGenerating = store((state) => state.setIsGenerating);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const { generateTitleForSession } = useTitleGenerator();
  const { generateRelatedQuestion } = useRelatedQuestions();
  const { addMessageMutation } = useSessions();
  const { isAtBottom, scrollToBottom } = useScrollToBottom();

  const targetResponse = assistantKey
    ? currentMessage?.aiResponses?.find((r) => r.assistant.key === assistantKey)
    : currentMessage;

  //   useEffect(() => {
  //     if (currentMessage?.id && prevMessagesIds?.includes(currentMessage?.id)) {
  //       setCurrentMessage(undefined);
  //     }
  //   }, [currentMessage?.id, prevMessagesIds?.length]);

  useEffect(() => {
    if (!assistantKey || !targetResponse?.rawAI) return;

    // Get the specific column's scroll container
    const container = document.querySelector(
      `[data-model-id="${assistantKey}"] .column-scroll-container`
    );

    // Smooth scroll to bottom when response updates
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [targetResponse?.rawAI, assistantKey]);

  useEffect(() => {
    if (
      !currentMessage ||
      !currentMessage.stop ||
      !currentMessage?.sessionId ||
      currentMessage.relatedQuestions?.length
    )
      return;

    const processMessage = async () => {
      if (!currentMessage.sessionId) return;
      try {
        const messages = await addMessageMutation.mutateAsync({
          parentId: currentMessage.sessionId,
          message: currentMessage,
        });

        setIsGenerating(false);

        if (messages?.[0]?.sessionId && messages?.length < 2) {
          await generateTitleForSession(messages[0].sessionId as string);
        }

        const questions = await generateRelatedQuestion(
          currentMessage.sessionId,
          currentMessage.id
        );

        if (questions?.length > 0) {
          const updatedMessage = {
            ...currentMessage,
            relatedQuestions: questions,
          };
          currentMessage.sessionId &&
            (await addMessageMutation.mutateAsync({
              parentId: currentMessage.sessionId,
              message: updatedMessage,
            }));
          setCurrentMessage(updatedMessage);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    processMessage();
  }, [currentMessage]);

  useEffect(() => {
    if (currentMessage?.id) {
      scrollToBottom();
    }
  }, [
    isGenerating,
    currentMessage?.relatedQuestions?.length,
    currentMessage?.tools?.length,
    currentMessage?.stop,
  ]);

  return (
    <>
      {currentMessage ? (
        <Message
          message={currentMessage}
          isLast={true}
          modelId={assistantKey}
        />
      ) : null}
      <ChatScrollAnchor
        isAtBottom={isAtBottom}
        trackVisibility={!currentMessage?.stop}
        hasMessages={!!currentMessage?.id}
      />
    </>
  );
};
