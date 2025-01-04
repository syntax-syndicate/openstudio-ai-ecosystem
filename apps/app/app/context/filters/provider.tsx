'use client';
import { useChatContext } from '@/app/context/chat/context';
import { FiltersContext } from '@/app/context/filters/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { useModelList } from '@/app/hooks/use-model-list';
import { Eraser, Plus, TrashSimple } from '@phosphor-icons/react';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { Button } from '@repo/design-system/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { cn } from '@repo/design-system/lib/utils';
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
  const { getModelByKey } = useModelList();

  const { toast } = useToast();

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
              className={cn('gap-3')}
              value="new"
              onSelect={(value) => {
                createSession().then((session) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                });
              }}
            >
              <Plus size={14} weight="bold" className="flex-shrink-0 " />
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
              <TrashSimple size={14} weight="bold" className="flex-shrink-0 " />
              Delete current session
            </CommandItem>
            <CommandItem
              className="gap-3"
              value="clear history"
              onSelect={(value) => {
                dismiss();
                toast({
                  title: 'Are you sure?',
                  description:
                    'This will clear all chat history. This action cannot be undone.',
                  variant: 'destructive',
                  action: (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        clearChatSessions().then(() => {
                          createSession().then((session) => {
                            router.push(`/chat/${session?.id}`);
                            dismiss();
                          });
                        });
                      }}
                    >
                      Delete
                    </Button>
                  ),
                });
              }}
            >
              <Eraser size={14} weight="bold" className="flex-shrink-0" />
              Clear History
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Sessions">
            {sortSessions(sessions, 'updatedAt')?.map((session) => (
              <CommandItem
                key={session.id}
                value={`${session.id}/${session.title}`}
                className={cn(
                  'w-full gap-3',
                  currentSession?.id === session.id
                    ? 'bg-black/10 dark:bg-black/10'
                    : ''
                )}
                onSelect={(value) => {
                  router.push(`/chat/${session.id}`);
                  dismiss();
                }}
              >
                {getModelByKey(session.messages?.[0]?.model)?.icon()}
                <span className="w-full truncate">{session.title}</span>
                <span className="flex-shrink-0 pl-4 text-sm text-zinc-400 md:text-base dark:text-zinc-700">
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
