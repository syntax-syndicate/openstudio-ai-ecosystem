'use client';

import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { Navbar } from '@/app/(authenticated)/chat/components/layout/navbar';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages/chat-messages';
import { useSessionsContext } from '@/app/context/sessions';
import Spinner from '@repo/design-system/components/ui/loading-spinner';

const ChatSessionPage = () => {
  const { isCurrentSessionLoading, isAllSessionLoading } = useSessionsContext();

  const renderLoader = () => {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  };
  const isLoading = isCurrentSessionLoading || isAllSessionLoading;

  return (
    <div className="relative flex h-[100%] w-full flex-row overflow-hidden rounded-xl bg-white dark:bg-zinc-800">
      <Navbar />
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
