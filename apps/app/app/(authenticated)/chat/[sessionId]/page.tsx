'use client';

import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { Sidebar } from '@/app/(authenticated)/chat/components/layout/sidebar';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages/chat-messages';
import { useSessions } from '@/context/sessions';
import { Spinner } from '@repo/design-system/components/ui/loading-spinner';

const ChatSessionPage = () => {
  const { isAllSessionLoading } = useSessions();

  const renderLoader = () => {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  };
  const isLoading = isAllSessionLoading;

  return (
    <div className="relative flex h-[100%] w-full flex-row overflow-hidden bg-white dark:bg-zinc-800">
      <Sidebar />
      {isLoading && renderLoader()}
      {!isLoading && (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      )}
    </div>
  );
};
export default ChatSessionPage;
