import {
  type ActivityIcon,
  CogIcon,
  HomeIcon,
  MessageCircleIcon,
} from 'lucide-react';

export type SidebarPage = {
  readonly icon: typeof ActivityIcon;
  readonly label: string;
  readonly href: string;
  readonly active: (pathname: string) => boolean;
  readonly items?: Omit<SidebarPage, 'items' | 'icon'>[];
};

export const home: SidebarPage = {
  icon: HomeIcon,
  label: 'Home',
  href: '/',
  active: (pathname) => pathname === '/',
};

export const chat: SidebarPage = {
  icon: MessageCircleIcon,
  label: 'ChatHub',
  href: '/chat',
  active: (pathname) => pathname === '/chat',
};

export const settings: SidebarPage = {
  icon: CogIcon,
  label: 'Settings',
  href: '/settings',
  active: (pathname) => pathname.startsWith('/settings'),
};
