'use client';

import { usePreferenceContext } from '@/context';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { fetcher, generateUUID } from '@/lib/utils';
import type { Attachment } from '@repo/ai';
import { type Message, useChat } from '@repo/ai/lib/react';
import type { Vote } from '@repo/backend/schema';
import { useState } from 'react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import { MultimodalInput } from './multimodal-input';
import { ChatTopNav } from '../../../chat/components/chat-input/chat-top-nav';
import { Messages } from './messages';
import { ChatHeader } from './chat-header';
import { Artifact } from './artifact';
export function Chat({
  id,
  initialMessages,
  selectedChatModel,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
}) {
  const { preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const { mutate } = useSWRConfig();
  const props = getAssistantByKey(preferences.defaultAssistant);

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: {
      id,
      selectedChatModel: selectedChatModel,
      runConfig: {
        assistant: props!.assistant,
        sessionId: id,
      },
    },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate(`/api/history`);
    },
    onError: (error) => {
      console.log(error);
      toast.error('An error occured, please try again');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  return (
    <>
      <div className="flex h-dvh min-w-0 flex-col">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          // selectedVisibilityType={selectedVisibilityType}
          isReadonly={false}
        />
        <Messages
          chatId={id}
          isLoading={isLoading}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={false}
          isArtifactVisible={isArtifactVisible}
        />
        <form className="flex mx-auto px-4 pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          setMessages={setMessages}
          append={append}
        />
        </form>

        <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
          votes={votes}
          isReadonly={false}
        />
      </div>
    </>
  );
}
