'use client';

import { useChatContext } from '@/app/context/chat/context';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const App = async () => {
  const router = useRouter();
  const { createSession } = useChatContext();
  useEffect(() => {
    createSession().then((session) => {
      router.push(`/chat/${session.id}`);
    });
  }, []);

  return (
    <main className="flex h-screen w-screen flex-row items-center justify-center">
      <Spinner />
    </main>
  );
};

export default App;
