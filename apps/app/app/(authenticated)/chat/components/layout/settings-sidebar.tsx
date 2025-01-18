import type { TSettingMenu } from '@/app/(authenticated)/chat/settings/layout';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import {
  AudioLines,
  Bolt,
  Brain,
  Database,
  Sparkle,
  ToyBrick,
} from 'lucide-react';

import { usePathname, useRouter } from 'next/navigation';

export const SettingsSidebar = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const settingMenu: TSettingMenu[] = [
    {
      name: 'Common',
      icon: Bolt,
      route: '/chat/settings/common',
    },
    {
      name: 'LLMs',
      icon: Sparkle,
      route: '/chat/settings/llms',
    },
    {
      name: 'Plugins',
      icon: ToyBrick,
      route: '/chat/settings/plugins',
    },
    {
      name: 'Memory',
      icon: Brain,
      route: '/chat/settings/memory',
    },
    {
      name: 'Voice Input',
      icon: AudioLines,
      route: '/chat/settings/voice',
    },
    {
      name: 'Data',
      icon: Database,
      route: '/chat/settings/data',
    },
  ];
  const renderMenuItem = (menu: TSettingMenu) => {
    const isSelected = pathname.startsWith(menu.route);
    const Icon = menu.icon;
    return (
      <Button
        variant={isSelected ? 'secondary' : 'ghost'}
        key={menu.route}
        onClick={() => push(menu.route)}
        className="w-full justify-start gap-2"
      >
        <Icon size={16} strokeWidth={2} className="dark:text-zinc-500" />
        <span className={cn('font-medium md:flex')}>{menu.name}</span>
      </Button>
    );
  };
  return (
    <div className="relative flex h-[98dvh] w-[220px] flex-shrink-0 flex-row rounded-xl p-1">
      <Flex
        direction="col"
        gap="xs"
        justify="start"
        className="h-full w-[280px] p-1.5"
      >
        {settingMenu.map(renderMenuItem)}
      </Flex>
    </div>
  );
};
