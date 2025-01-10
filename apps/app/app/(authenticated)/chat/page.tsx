'use client';
import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { MainLayout } from '@/app/(authenticated)/chat/components/layout/main-layout';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages/chat-messages';
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
      <div className="flex h-full w-full items-center justify-center">
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
            <MainLayout>
              <div className="relative flex h-[100%] w-full flex-row overflow-hidden bg-white dark:bg-zinc-800">
                <ChatMessages />
                <ChatInput />
              </div>
            </MainLayout>
          </PromptsProvider>
        </AssistantsProvider>
      </CommandsProvider>
    </ChatProvider>
  );
};
export default ChatSessionPage;
