'use client';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { useSessions } from '@/context';
import { Spinner } from '@repo/design-system/components/ui/loading-spinner';
import { useEffect } from 'react';

const ChatPage = () => {
  const { createSession } = useSessions();
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
