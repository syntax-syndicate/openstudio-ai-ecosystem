'use client';
import { useChatContext } from '@/app/context/chat/context';
import { FiltersContext } from '@/app/context/filters/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import { useModelList } from '@/app/hooks/use-model-list';
import { Plus, TrashSimple } from '@phosphor-icons/react';
import { Moon, Sun } from '@phosphor-icons/react';
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
import { useTheme } from 'next-themes';
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
  const { toast, dismiss } = useToast();
  const { sortSessions } = useChatSession();
  const router = useRouter();
  const { getModelByKey } = useModelList();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const open = () => setIsFilterOpen(true);

  const onClose = () => setIsFilterOpen(false);

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

  const actions = [
    {
      name: 'New session',
      icon: Plus,
      action: () => {
        createSession().then((session) => {
          router.push(`/chat/${session.id}`);
          dismiss();
        });
      },
    },
    {
      name: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
      icon: theme === 'light' ? Moon : Sun,
      action: () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        dismiss();
      },
    },
    {
      name: 'Delete current session',
      icon: TrashSimple,
      action: () => {
        onClose();
        toast({
          title: 'Delete Session?',
          description: 'This action cannot be undone.',
          variant: 'destructive',
          action: (
            <Button
              size="sm"
              variant="default"
              onClick={() => {
                currentSession?.id &&
                  removeSession(currentSession?.id).then(() => {
                    createSession().then((session) => {
                      router.push(`/chat/${session.id}`);
                      dismiss();
                    });
                  });
              }}
            >
              Delete
            </Button>
          ),
        });
      },
    },
  ];

  return (
    <FiltersContext.Provider value={{ open, dismiss: onClose }}>
      {children}

      <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            {actions.map((action) => (
              <CommandItem
                key={action.name}
                className="gap-2"
                value={action.name}
                onSelect={action.action}
              >
                <action.icon
                  size={14}
                  weight="bold"
                  className="flex-shrink-0"
                />
                {action.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Sessions">
            {sortSessions(sessions, 'updatedAt')?.map((session) => (
              <CommandItem
                key={session.id}
                value={`${session.id}/${session.title}`}
                className={cn(
                  'w-full gap-2',
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
                <span className="flex-shrink-0 pl-4 text-xs text-zinc-400 md:text-xs dark:text-zinc-700">
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
