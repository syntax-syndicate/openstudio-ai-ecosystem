'use client';

import { Link } from '@repo/design-system/components/link';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { CogIcon, ExternalLinkIcon, UsersIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pages = [
  {
    icon: CogIcon,
    label: 'General',
    href: '/settings',
  },
  {
    icon: UsersIcon,
    label: 'Members',
    href: '/settings/members',
  },
];

export const SettingsNavigation = () => {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/settings' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col gap-0.5 overflow-y-auto p-2.5">
      {pages.map((page) => (
        <Button
          key={page.href}
          variant="ghost"
          className={cn(
            'w-full justify-start gap-2 px-3 font-normal',
            isActive(page.href) &&
              'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary'
          )}
        >
          <Link
            href={page.href}
            external={page.href.startsWith('/api')}
            className="flex items-center gap-2"
          >
            <page.icon
              size={16}
              className={cn(
                'shrink-0 text-muted-foreground',
                isActive(page.href) && 'text-primary'
              )}
            />
            <span className="flex-1">{page.label}</span>
            {page.href.startsWith('/api') && (
              <ExternalLinkIcon
                size={16}
                className={cn(
                  'shrink-0 text-muted-foreground',
                  isActive(page.href) && 'text-primary'
                )}
              />
            )}
          </Link>
        </Button>
      ))}
    </div>
  );
};
