import { useChatContext } from '@/app/context/chat/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { useModelList } from '@/app/hooks/use-model-list';
import { Plus, SidebarSimple } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Drawer } from 'vaul';

export const HistorySidebar = () => {
  const {
    sessions,
    createSession,
    clearChatSessions,
    removeSession,
    currentSession,
  } = useChatContext();
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const { sortSessions } = useChatSession();
  const router = useRouter();
  const { getModelByKey } = useModelList();
  return (
    <Drawer.Root direction="left" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="iconSm">
          <SidebarSimple size={20} weight="bold" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[900] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
        <Drawer.Content
          className={cn(
            'fixed top-2 left-2 z-[901] flex h-[98dvh] w-[280px] flex-col rounded-3xl outline-none md:bottom-2 '
          )}
        >
          <div className="relative flex flex-1 flex-row rounded-2xl bg-white p-2 dark:border dark:border-white/5 dark:bg-zinc-700">
            <div className="flex w-full flex-col overflow-y-auto no-scrollbar">
              <div className="flex flex-row justify-between">
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <SidebarSimple size={20} weight="bold" />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => {
                    createSession().then((session) => {
                      push(`/chat/${session.id}`);
                    });
                  }}
                >
                  <Plus size={20} weight="bold" />
                </Button>
              </div>
              <div className="mt-2 p-2">
                <p className="text-sm text-zinc-500">Recent History</p>
              </div>
              {sortSessions(sessions, 'updatedAt')?.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    'flex w-full cursor-pointer flex-row items-center gap-2 rounded-xl p-2 hover:bg-black/10 hover:dark:bg-black/30',
                    currentSession?.id === session.id
                      ? 'bg-black/10 dark:bg-black/30'
                      : ''
                  )}
                  onClick={() => {
                    router.push(`/chat/${session.id}`);
                    setOpen(false);
                  }}
                >
                  {getModelByKey(session.messages?.[0]?.model)?.icon()}
                  <span className="w-full truncate text-xs md:text-sm">
                    {session.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute right-[-20px] flex h-full w-4 flex-col items-center justify-center">
              <div className="mb-4 h-4 w-1 flex-shrink-0 rounded-full bg-white/50" />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
