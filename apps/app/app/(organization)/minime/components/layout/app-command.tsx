'use client';
import { createArticle } from '@/app/(organization)/minime/components/articles/article-create-button';
import { createProject } from '@/app/(organization)/minime/components/projects/project-create-button';
import { appConfig } from '@/config/links';
import useAppCommand from '@/hooks/use-app-command';
import type { Icon } from '@/types/minime';
import type { User } from '@repo/backend/auth';
import { createClient } from '@repo/backend/auth/client';
import { getUserName } from '@repo/backend/auth/format';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/design-system/components/ui/command';
import { Icons } from '@repo/design-system/components/ui/icons';
import { handleError } from '@repo/design-system/lib/handle-error';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

type Group = {
  heading: string;
  items: Item[];
  icon?: Icon;
};

type Item = {
  command: () => unknown;
  children: ReactNode;
  className?: string;
};

export default function AppCommand({ user }: { user: User }) {
  const { isOpen, toggle, setOpen } = useAppCommand();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<'article' | 'project' | null>(
    null
  );
  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    try {
      const client = await createClient();
      const response = await client.auth.signOut();

      if (response.error) {
        throw response.error;
      }

      router.push('/sign-in');
    } catch (error) {
      handleError(error);
    }
  };

  const newArticle = async () => {
    setIsLoading('article');
    const article = await createArticle();
    setIsLoading(null);
    if (article) {
      router.push(`/articles/${article.id}`);
      router.refresh();
    }
  };

  const newProject = async () => {
    setIsLoading('project');
    const project = await createProject();
    setIsLoading(null);
    if (project) {
      router.push(`/projects/${project.id}`);
      router.refresh();
    }
  };

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', keyDown);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, [isOpen, setOpen, toggle]);

  const runCommand = useCallback(
    async (command: () => Promise<unknown> | unknown) => {
      await command();
      setOpen(false);
    },
    [setOpen]
  );

  const ThemeIcon = Icons[theme === 'dark' ? 'sun' : 'moon'];
  const PlusIcon = ({ type }: { type?: 'article' | 'project' }) =>
    isLoading === type ? (
      <Icons.spinner size={18} className="animate-spin text-gray-4" />
    ) : (
      <Icons.plus size={18} />
    );

  const groups: Group[] = [
    {
      heading: 'Quick actions',
      items: [
        {
          command: newArticle,
          children: (
            <>
              <PlusIcon type="article" /> New article
            </>
          ),
        },
        {
          command: newProject,
          children: (
            <>
              <PlusIcon type="project" /> New project
            </>
          ),
        },
        {
          command: () => router.push('/bookmarks?action=newBookmark'),
          children: (
            <>
              <PlusIcon /> New bookmark
            </>
          ),
        },
        {
          command: () => router.push('/bookmarks?action=newCollection'),
          children: (
            <>
              <PlusIcon /> New collection
            </>
          ),
        },
        {
          command: () => router.push('/bookmarks?action=manageCollections'),
          children: (
            <>
              <Icons.collection size={18} /> Manage collections
            </>
          ),
        },
      ],
    },
    {
      heading: 'Navigation',
      icon: 'arrowRight',
      items: appConfig.mainNav.map((l) => {
        return {
          command: () => router.push(l.href),
          children: `Go to ${l.title}`,
        };
      }),
    },
    {
      heading: 'General',
      items: [
        {
          command: () =>
            window.open(
              `https://${user.user_metadata.domain || `${getUserName(user!)}.openstudio.tech`}`,
              '_blank'
            ),
          children: (
            <>
              <Icons.arrowUpRight size={18} /> Your page
            </>
          ),
        },
        {
          command: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
          children: (
            <>
              <ThemeIcon size={18} /> Switch to{' '}
              {theme === 'dark' ? 'light' : 'dark'}
            </>
          ),
        },
        {
          command: () => router.push('/settings'),
          children: (
            <>
              <Icons.settings size={18} /> Settings
            </>
          ),
        },
        {
          command: () => window.open('https://openstudio.tech', '_blank'),
          children: (
            <>
              <Icons.logo size={18} /> Home page
            </>
          ),
        },
        {
          command: () => handleSignOut(),
          children: (
            <>
              <Icons.logout size={18} /> Log out
            </>
          ),
          className: '!text-danger',
        },
      ],
    },
  ];

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="What do you need?" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(({ heading, items, icon }) => (
          <CommandGroup heading={heading} key={heading}>
            {items.map(({ command, children, className }, i) => {
              const Icon = icon ? Icons[icon] : () => null;
              return (
                <CommandItem
                  onSelect={() => runCommand(command)}
                  className={className}
                  key={i}
                >
                  {icon && <Icon size={18} />} {children}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
