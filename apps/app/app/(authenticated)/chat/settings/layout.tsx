'use client';
import {
  ArrowLeft01Icon,
  BrainIcon,
  DashboardCircleIcon,
  Database02Icon,
  Settings03Icon,
  SparklesIcon,
  VoiceIcon,
} from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';

export type TSettingMenu = {
  name: string;
  //TODO: later add hugeicons props
  // icon: FC<Omit<HugeiconsProps, "ref"> & RefAttributes<SVGSVGElement>>;
  icon: any;
  route: string;
};

export default function SettingsPage({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  const { push } = useRouter();

  const settingMenu: TSettingMenu[] = [
    {
      name: 'Common',
      icon: Settings03Icon,
      route: '/chat/settings/common',
    },
    {
      name: 'LLMs',
      icon: SparklesIcon,
      route: '/chat/settings/llms',
    },
    {
      name: 'Plugins',
      icon: DashboardCircleIcon,
      route: '/chat/settings/plugins',
    },
    {
      name: 'Memory',
      icon: BrainIcon,
      route: '/chat/settings/memory',
    },
    {
      name: 'Voice Input',
      icon: VoiceIcon,
      route: '/chat/settings/voice',
    },
    {
      name: 'Data',
      icon: Database02Icon,
      route: '/chat/settings/data',
    },
  ];

  useEffect(() => {
    if (pathname === '/chat/settings') {
      push('/chat/settings/common');
    }
  }, [pathname]);

  const renderMenuItem = (menu: TSettingMenu) => {
    const isSelected = pathname.startsWith(menu.route);
    const Icon = menu.icon;
    return (
      <Button
        variant={isSelected ? 'secondary' : 'ghost'}
        key={menu.route}
        onClick={() => push(menu.route)}
        className="w-full justify-start gap-2"
        size="sm"
      >
        <Icon
          size={16}
          strokeWidth={2}
          variant="solid"
          className="dark:text-zinc-500"
        />
        <span className={cn('font-medium text-xs md:flex md:text-sm')}>
          {menu.name}
        </span>
      </Button>
    );
  };

  return (
    <Flex justify="center" className="w-full">
      <Flex className="relative h-[100dvh] w-[800px]">
        <Flex
          direction="col"
          gap="xs"
          justify="start"
          className="w-[180px] pt-[60px]"
        >
          <Button
            className="w-full"
            variant="outlined"
            size="sm"
            onClick={() => {
              push('/chat');
            }}
          >
            <ArrowLeft01Icon size={16} />
            Back
          </Button>
          <div className="h-2" />
          {settingMenu.map(renderMenuItem)}
        </Flex>
        <Flex className="no-scrollbar h-full w-full flex-1 overflow-y-auto px-4 py-[60px]">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}
