import type { TSettingMenu } from '@/app/(organization)/chat/settings/layout';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import {
  AudioLines,
  Bolt,
  Brain,
  Database,
  Sparkle,
  ToyBrick,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const SettingsTabs = () => {
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
      route: '/chat/settings/llms/openai',
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
      <Flex direction="col" gap="sm" className="relative pb-2">
        <Button
          variant={'ghost'}
          key={menu.route}
          size="sm"
          onClick={() => push(menu.route)}
          className="w-full justify-start gap-2"
        >
          <Icon
            size={14}
            strokeWidth={2}
            className="opacity-50 dark:text-white"
          />
          <span className={cn('font-medium md:flex')}>{menu.name}</span>
        </Button>
        {isSelected && (
          <motion.div
            className="absolute right-0 bottom-0 left-0 h-[2px] bg-zinc-800 dark:bg-white"
            layoutId="underline"
            initial={false}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </Flex>
    );
  };

  return (
    <Flex
      direction="row"
      gap="xs"
      className="no-scrollbar w-full overflow-x-auto"
    >
      {settingMenu.map(renderMenuItem)}
    </Flex>
  );
};
