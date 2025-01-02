'use client';
import { useChatContext } from '@/app/context/chat/context';
import { FiltersContext } from '@/app/context/filters/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { Eraser, Plus, StarFour, TrashSimple } from '@phosphor-icons/react';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export type TFiltersProvider = {
  children: React.ReactNode;
};

export const FiltersProvider = ({ children }: TFiltersProvider) => {
  const {
    sessions,
    createSession,
    clearChatSessions,
    removeSession,
    currentSession,
  } = useChatContext();
  const { sortSessions } = useChatSession();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const open = () => setIsFilterOpen(true);
  const dismiss = () => setIsFilterOpen(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsFilterOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  return (
    <FiltersContext.Provider value={{ open, dismiss }}>
      {children}
      <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              className="gap-3"
              value="new"
              onSelect={(value) => {
                createSession().then((session) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                });
              }}
            >
              <Plus
                size={14}
                weight="bold"
                className="flex-shrink-0 text-zinc-500"
              />
              New session
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="theme"
              onSelect={(value) => {
                dismiss();
              }}
            >
              <ModeToggle /> Toggle Theme
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="delete"
              onSelect={(value) => {
                currentSession?.id &&
                  removeSession(currentSession?.id).then(() => {
                    createSession().then((session) => {
                      router.push(`/chat/${session.id}`);
                      dismiss();
                    });
                  });
              }}
            >
              <TrashSimple
                size={14}
                weight="bold"
                className="flex-shrink-0 text-zinc-500"
              />
              Delete current session
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="clear history"
              onSelect={(value) => {
                clearChatSessions().then(() => {
                  createSession().then((session) => {
                    router.push(`/chat/${session?.id}`);
                    dismiss();
                  });
                });
              }}
            >
              <Eraser
                size={14}
                weight="bold"
                className="flex-shrink-0 text-zinc-500"
              />
              Clear History
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sessions">
            {sortSessions(sessions, 'updatedAt')?.map((session) => (
              <CommandItem
                key={session.id}
                value={`${session.id}/${session.title}`}
                className="w-full gap-3"
                onSelect={(value) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                }}
              >
                <StarFour
                  size={14}
                  weight="bold"
                  className="flex-shrink-0 text-zinc-500"
                />{' '}
                <span className="w-full truncate">{session.title}</span>
                <span className="flex-shrink-0 pl-4 text-xs text-zinc-400 dark:text-zinc-700">
                  {moment(session.createdAt).fromNow(true)}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FiltersContext.Provider>
  );
};
