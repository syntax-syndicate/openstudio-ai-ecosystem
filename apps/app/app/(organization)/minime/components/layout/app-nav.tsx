'use client';

import type { MinimeMainNavItem } from '@/types/minime';
import type { User } from '@repo/backend/auth';
import { Icons } from '@repo/design-system/components/ui/icons';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import MobileNav from './mobile-nav';
import NavButton from './nav-button';
import UserNav from './user-nav';

interface Props {
  links: MinimeMainNavItem[];
  user: User | null;
}

export default function AppNav({ links, user }: Props) {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="flex w-full items-center justify-between ">
      <Link
        href="/minime"
        className="flex items-center gap-2"
        aria-label="Go to home"
      >
        <Icons.logo size={30} /> Minime
      </Link>

      <div className="flex gap-2">
        <nav className="flex gap-2 max-md:hidden">
          {links.map((link) => (
            <NavButton
              href={link.href}
              key={link.title}
              size="sm"
              buttonClassname={
                link.href.endsWith(segment === null ? '/' : segment)
                  ? 'bg-gray-2'
                  : ''
              }
              buttonVariant="ghost"
            >
              {link.title}
            </NavButton>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MobileNav
            links={links}
            currentPath={segment === null ? '/' : `/${segment}`}
          />
          <UserNav user={user} segment={segment ?? undefined} />
        </div>
      </div>
    </div>
  );
}
