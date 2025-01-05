import { HistoryItem } from '@/app/(authenticated)/chat/components/history/history-item';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { sortSessions } from '@/app/lib/helper';
import { SidebarSimple, X } from '@phosphor-icons/react';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';
import { Drawer } from 'vaul';

export const HistorySidebar = () => {
  const { sessions, createSession, currentSession } = useSessionsContext();
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="iconSm">
          <SidebarSimple size={20} weight="bold" />
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[400] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
        <Drawer.Content
          className={cn(
            'fixed top-1 right-1 z-[901] flex h-[99dvh] w-[280px] flex-col rounded-3xl outline-none md:bottom-1 '
          )}
        >
          <div className="relative flex h-[98dvh] flex-1 flex-row rounded-2xl bg-white p-2 dark:border dark:border-white/5 dark:bg-zinc-800">
            <div className="absolute left-[-20px] flex h-full w-4 flex-col items-center justify-center">
              <div className="mb-4 h-4 w-1 flex-shrink-0 rounded-full bg-white/50" />
            </div>
            <div className="no-scrollbar flex w-full flex-col overflow-y-auto">
              <div className="flex flex-row justify-between">
                <div className="p-2">
                  <Flex
                    className="text-sm text-zinc-500"
                    items="center"
                    gap="sm"
                  >
                    <ClockCounterClockwise size={18} weight="bold" /> Recent
                    History
                  </Flex>
                </div>

                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <X size={18} weight="bold" />
                </Button>
              </div>

              {sortSessions(sessions, 'updatedAt')?.map((session) => (
                <HistoryItem
                  session={session}
                  key={session.id}
                  dismiss={() => {
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
