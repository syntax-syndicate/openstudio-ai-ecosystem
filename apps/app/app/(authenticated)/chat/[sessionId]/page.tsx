'use client';

import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/chat-messages';
import { Navbar } from '@/app/(authenticated)/chat/components/navbar';
import { useChatContext } from '@/app/context/chat/context';
import Spinner from '@repo/design-system/components/ui/loading-spinner';

const ChatSessionPage = () => {
  const { isCurrentSessionLoading, isAllSessionLoading } = useChatContext();

  const renderLoader = () => {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  };
  const isLoading = isCurrentSessionLoading || isAllSessionLoading;

  return (
    <div className="relative flex h-screen w-full flex-row overflow-hidden">
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
