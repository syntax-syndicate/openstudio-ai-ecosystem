'use client';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { Button } from '@repo/design-system/components/ui/button';
import { useRouter } from 'next/navigation';
export const Sidebar = () => {
  const { sessions, createSession } = useSessionsContext();
  const { push } = useRouter();
  return (
    <div className="flex h-[100dvh] w-[250px] flex-col">
      <Button
        onClick={() => {
          createSession({
            redirect: true,
          });
        }}
      >
        New Session
      </Button>
      {sessions?.map((session) => (
        <div
          key={session.id}
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
