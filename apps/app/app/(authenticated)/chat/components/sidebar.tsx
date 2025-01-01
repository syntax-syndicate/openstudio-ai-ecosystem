'use client';
import { useChatContext } from '@/app/context/chat/context';
import { Button } from '@repo/design-system/components/ui/button';
import { useRouter } from 'next/navigation';
export const Sidebar = () => {
  const { sessions, createSession } = useChatContext();
  const { push } = useRouter();
  return (
    <div className="flex h-screen w-[250px] flex-col">
      <Button
        onClick={() => {
          createSession();
        }}
      >
        New Session
      </Button>
      {sessions?.map((session) => (
        <div
          className="p-2"
          onClick={() => {
            push(`/chat/${session.id}`);
          }}
        >
          {session?.title}
        </div>
      )) || 'No sessions found'}
    </div>
  );
};
