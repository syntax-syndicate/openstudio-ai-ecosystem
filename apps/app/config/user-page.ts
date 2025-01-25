import type { UserPageConfig } from '@/types/minime';

export const userPageConfig: UserPageConfig = {
  pages: [
    {
      title: 'Home',
      href: '/',
      icon: 'home',
    },
    {
      title: 'Articles',
      href: '/articles',
      icon: 'edit',
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: 'layers',
    },
    {
      title: 'Bookmarks',
      href: '/bookmarks',
      icon: 'bookmark',
    },
  ],
} as const;
