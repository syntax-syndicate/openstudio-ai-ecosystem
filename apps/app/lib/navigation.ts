import {
  type ActivityIcon,
  CogIcon,
  FlameIcon,
  HomeIcon,
  MessageCircleCodeIcon,
  MessageCircleIcon,
  PlaySquareIcon,
  UserIcon,
  VideoIcon,
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

export const minime: SidebarPage = {
  icon: UserIcon,
  label: 'Minime',
  href: '/minime',
  active: (pathname) => pathname === '/minime',
};

export const chat: SidebarPage = {
  icon: MessageCircleIcon,
  label: 'ChatHub',
  href: '/chat',
  active: (pathname) => pathname === '/chat',
};

export const chatv2: SidebarPage = {
  icon: MessageCircleCodeIcon,
  label: 'Artifacts',
  href: '/chatv2',
  active: (pathname) => pathname === '/chatv2',
};

export const settings: SidebarPage = {
  icon: CogIcon,
  label: 'Settings',
  href: '/settings',
  active: (pathname) => pathname.startsWith('/settings'),
};

export const tube: SidebarPage = {
  icon: VideoIcon,
  label: 'Tube',
  href: '/tube',
  active: (pathname) => pathname === '/tube',
};

export const tubeHome: SidebarPage = {
  icon: HomeIcon,
  label: 'Tube Home',
  href: '/tube',
  active: (pathname) => pathname === '/tube',
};

// export const tubeSubscribed: SidebarPage = {
//   icon: PlaySquareIcon,
//   label: 'Subscribed',
//   href: '/tube/feed/subscribed',
//   active: (pathname) => pathname === '/tube/feed/subscribed',
// };

// export const tubeTrending: SidebarPage = {
//   icon: FlameIcon,
//   label: 'Trending',
//   href: '/tube/feed/trending',
//   active: (pathname) => pathname === '/tube/feed/trending',
// };
