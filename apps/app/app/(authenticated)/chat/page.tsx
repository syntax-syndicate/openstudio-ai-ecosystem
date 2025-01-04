'use client';
import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { useChatContext } from '@/app/context/chat/context';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { useEffect } from 'react';

const ChatPage = async () => {
  const { createSession } = useChatContext();
  useEffect(() => {
    createSession({
      redirect: true,
    });
  }, []);
  return (
    <main className="flex h-[100dvh] w-screen flex-col items-center justify-center gap-2">
      <ModelIcon type="chathub" size="lg" />
      <Spinner />
    </main>
  );
};
export default ChatPage;
