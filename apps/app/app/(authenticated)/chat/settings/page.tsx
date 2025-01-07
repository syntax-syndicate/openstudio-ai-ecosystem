'use client';
import { CommonSettings } from '@/app/(authenticated)/chat/components/settings/common';
import { Data } from '@/app/(authenticated)/chat/components/settings/data';
import { MemorySettings } from '@/app/(authenticated)/chat/components/settings/memory';
import { ModelSettings } from '@/app/(authenticated)/chat/components/settings/models';
import { PulginSettings } from '@/app/(authenticated)/chat/components/settings/plugins';
import { VoiceInput } from '@/app/(authenticated)/chat/components/settings/voice-input';
import {
  BrainIcon,
  DashboardCircleIcon,
  Database02Icon,
  Settings03Icon,
  SparklesIcon,
  VoiceIcon,
} from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';

export type TSettingMenuItem = {
  name: string;
  key: string;
  icon: () => React.ReactNode;
  component: React.ReactNode;
};
export type TSettingRoutes =
  | 'common'
  | 'models'
  | 'models/anthropic'
  | 'models/openai'
  | 'models/gemini'
  | 'models/ollama'
  | 'plugins'
  | 'plugins/web-search'
  | 'memory'
  | 'voice-input'
  | 'data';
export default function SettingsPage() {
  const [selectedMenu, setSelectedMenu] = useState<TSettingRoutes>('common');
  const settingMenu: TSettingMenuItem[] = [
    {
      name: 'Common',
      icon: () => <Settings03Icon size={18} strokeWidth="2" />,
      key: 'common',
      component: <CommonSettings />,
    },
    {
      name: 'LLMs',
      icon: () => <SparklesIcon size={18} strokeWidth="2" />,
      key: 'models',
      component: <ModelSettings />,
    },
    {
      name: 'Plugins',
      icon: () => <DashboardCircleIcon size={18} strokeWidth="2" />,
      key: 'plugins',
      component: <PulginSettings />,
    },
    {
      name: 'Memory',
      icon: () => <BrainIcon size={18} strokeWidth="2" />,
      key: 'memory',
      component: <MemorySettings />,
    },
    {
      name: 'Voice Input',
      icon: () => <VoiceIcon size={18} strokeWidth="2" />,
      key: 'voice-input',
      component: <VoiceInput />,
    },
    {
      name: 'Data',
      icon: () => <Database02Icon size={18} strokeWidth="2" />,
      key: 'data',
      component: <Data />,
    },
  ];
  const selectedMenuItem = settingMenu.find((menu) =>
    selectedMenu.startsWith(menu.key)
  );
  return (
    <div className="flex h-screen w-full flex-col gap-0 overflow-hidden bg-zinc-800 p-0">
      <div className="relative flex h-screen w-full flex-col overflow-hidden md:flex-row">
        <div className="no-scrollbar absolute top-0 right-0 left-0 flex w-full flex-row items-end gap-1 overflow-x-auto border-zinc-500/10 bg-zinc-900/50 px-2 pt-2 pb-2 md:bottom-0 md:h-full md:w-[420px] md:flex-col md:gap-0 md:overflow-y-auto md:pb-16">
          <div className="flex w-[200px] flex-col gap-1 p-4">
            {settingMenu.map((menu) => (
              <Button
                variant={selectedMenu === menu.key ? 'secondary' : 'ghost'}
                key={menu.key}
                onClick={() => setSelectedMenu(menu.key as TSettingRoutes)}
                className="justify-start gap-2 px-2"
                size="default"
              >
                <div className="flex h-6 w-6 flex-row items-center justify-center">
                  {menu.icon()}
                </div>
                <span
                  className={cn(
                    'font-medium text-xs md:flex md:text-sm',
                    selectedMenu === menu.key ? 'flex' : 'hidden'
                  )}
                >
                  {menu.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className="no-scrollbar mt-12 h-full w-full max-w-[700px] overflow-y-auto p-8 pb-16 md:mt-0 md:ml-[420px]">
          {selectedMenuItem?.component}
        </div>
      </div>
    </div>
  );
}
