'use client';

import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/chat-messages';
import { useParams } from 'next/navigation';

const chatSessionPage = () => {
  const { sessionId } = useParams();
  return (
    <div className="relative flex h-screen w-full flex-row overflow-hidden">
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
export default chatSessionPage;
