'use client';

import { FiltersContext } from '@/app/context/filters/context';
import { useSessionsContext } from '@/app/context/sessions/provider';
import { useModelList } from '@/app/hooks/use-model-list';
import { sortSessions } from '@/app/lib/helper';
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
    removeSessionMutation,
    clearSessionsMutation,
    currentSession,
    refetchSessions,
  } = useSessionsContext();
  const { toast, dismiss } = useToast();
  const router = useRouter();
  const { getModelByKey, getAssistantByKey } = useModelList();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const open = () => {
    refetchSessions?.();
    setIsFilterOpen(true);
  };

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
        createSession({
          redirect: true,
        });
        onClose();
      },
    },
    {
      name: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
      icon: theme === 'light' ? Moon : Sun,
      action: () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        onClose();
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
                  removeSessionMutation.mutate(currentSession?.id, {
                    onSuccess() {
                      createSession({
                        redirect: true,
                      });
                      dismiss();
                    },
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
        <CommandList className="border-zinc-500/20 border-t">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="QuickActions">
            {actions.map((action) => (
              <CommandItem
                key={action.name}
                className="gap-2"
                value={action.name}
                onSelect={action.action}
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  <action.icon
                    size={16}
                    weight="bold"
                    className="flex-shrink-0"
                  />
                </div>
                {action.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Recent Conversations">
            {sortSessions(sessions, 'updatedAt')?.map((session) => {
              const assistantProps = getAssistantByKey(
                session.messages?.[0]?.inputProps?.assistant?.key
              );
              return (
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
                    onClose();
                  }}
                >
                  {assistantProps?.model.icon('sm')}
                  <span className="w-full truncate">{session.title}</span>
                  <span className="flex-shrink-0 pl-4 text-xs text-zinc-400 md:text-xs dark:text-zinc-700">
                    {moment(session.createdAt).fromNow(true)}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FiltersContext.Provider>
  );
};
