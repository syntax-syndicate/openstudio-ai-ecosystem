import { HistoryItem } from '@/app/(authenticated)/chat/components/history/history-item';
import { useSessionsContext } from '@/app/context';
import { sortSessions } from '@/app/lib/helper';
import { SidebarLeftIcon } from '@hugeicons/react';
import { ClockCounterClockwise, X } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';
import { Drawer } from 'vaul';

export const HistorySidebar = () => {
  const { sessions, createSession, currentSession } = useSessionsContext();
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root direction="left" open={open} onOpenChange={setOpen}>
      <Tooltip content="Chat History" side="left" sideOffset={4}>
        <Drawer.Trigger asChild>
          <Button variant="ghost" size="iconSm">
            <SidebarLeftIcon size={20} variant="stroke" strokeWidth="2" />
          </Button>
        </Drawer.Trigger>
      </Tooltip>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[10] bg-zinc-500/70 backdrop-blur-sm dark:bg-zinc-900/70" />
        <Drawer.Content
          className={cn(
            'fixed top-2 left-2 z-[901] flex h-[98dvh] w-[320px] flex-col rounded-3xl outline-none md:bottom-2 '
          )}
        >
          <div className="relative flex h-[98dvh] flex-1 flex-row rounded-2xl bg-white p-2 dark:border dark:border-white/5 dark:bg-zinc-800">
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
            <div className="absolute right-[-20px] flex h-full w-4 flex-col items-center justify-center">
              <div className="mb-4 h-4 w-1 flex-shrink-0 rounded-full bg-white/50" />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
