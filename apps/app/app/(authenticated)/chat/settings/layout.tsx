'use client';
import {
  ArrowLeft02Icon,
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
    console.log(pathname);
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
        className="w-full justify-start gap-2 px-2"
        size="default"
      >
        <div className="flex h-6 w-6 flex-row items-center justify-center">
          <Icon size={18} variant="solid" className="dark:text-zinc-500" />
        </div>
        <span
          className={cn(
            'font-medium text-xs md:flex md:text-sm',
            isSelected ? 'flex' : 'hidden'
          )}
        >
          {menu.name}
        </span>
      </Button>
    );
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-white md:flex-row dark:bg-zinc-800">
      <div className="no-scrollbar absolute top-0 right-0 left-0 flex w-full flex-row items-end gap-1 overflow-x-auto border-zinc-500/10 bg-zinc-50/50 px-2 pt-2 pb-2 md:bottom-0 md:h-full md:w-[30vw] md:flex-col md:gap-0 md:overflow-y-auto md:pb-16 dark:bg-zinc-900/50">
        <div className="flex w-[200px] flex-col items-end gap-2 p-4">
          <Button
            onClick={() => push('/')}
            variant="ghost"
            className="w-full justify-start gap-2 px-2"
          >
            <div className="flex h-6 w-6 flex-row items-center justify-center">
              <ArrowLeft02Icon size={20} strokeWidth={2} />
            </div>
            Back
          </Button>
          <Flex direction="col" gap="xs" className="w-full">
            {settingMenu.map(renderMenuItem)}
          </Flex>
        </div>
      </div>
      <div className="no-scrollbar mt-12 h-full w-full max-w-[720px] overflow-y-auto p-8 pb-16 md:mt-0 md:ml-[30vw]">
        {children}
      </div>
    </div>
  );
}
