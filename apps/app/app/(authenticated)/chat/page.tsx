'use client';
import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages';
import {
  AssistantsProvider,
  ChatProvider,
  CommandsProvider,
  PromptsProvider,
  useSessions,
} from '@/context';
import { Spinner } from '@repo/design-system/components/ui/loading-spinner';

const ChatSessionPage = () => {
  const { isAllSessionLoading, activeSessionId } = useSessions();
  const renderLoader = () => {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner />
      </div>
    );
  };
  const isLoading = isAllSessionLoading || !activeSessionId;
  if (isLoading) return renderLoader();
  return (
    <ChatProvider sessionId={activeSessionId}>
      <CommandsProvider>
        <AssistantsProvider>
          <PromptsProvider>
            <div className="relative flex h-[100%] w-full flex-row overflow-hidden bg-zinc-50/50 dark:bg-zinc-800">
              <ChatMessages />
              <ChatInput />
            </div>
          </PromptsProvider>
        </AssistantsProvider>
      </CommandsProvider>
    </ChatProvider>
  );
};
export default ChatSessionPage;
