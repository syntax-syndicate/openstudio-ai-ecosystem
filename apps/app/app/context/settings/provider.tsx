'use client';

import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { AnthropicSettings } from '@/app/(authenticated)/chat/components/settings/anthropic';
import { GeminiSettings } from '@/app/(authenticated)/chat/components/settings/gemini';
import { OpenAISettings } from '@/app/(authenticated)/chat/components/settings/openai';
import { GearSix } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';

import { CommonSettings } from '@/app/(authenticated)/chat/components/settings/common';
import { SettingsContext } from '@/app/context/settings/context';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';

export type TSettingsProvider = {
  children: React.ReactNode;
};
export type TSettingMenuItem = {
  name: string;
  key: string;
  icon: () => React.ReactNode;
  component: React.ReactNode;
};
export const SettingsProvider = ({ children }: TSettingsProvider) => {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('common');
  const open = (key?: string) => {
    setIsSettingOpen(true);
    setSelectedMenu(key || 'common');
  };
  const dismiss = () => setIsSettingOpen(false);
  const settingMenu: TSettingMenuItem[] = [
    {
      name: 'Common',
      icon: () => <GearSix size={16} weight="bold" />,
      key: 'common',
      component: <CommonSettings />,
    },
  ];
  const modelsMenu: TSettingMenuItem[] = [
    {
      name: 'OpenAI',
      key: 'openai',
      icon: () => <ModelIcon type="openai" size="md" />,
      component: <OpenAISettings />,
    },
    {
      name: 'Anthropic',
      key: 'anthropic',
      icon: () => <ModelIcon type="anthropic" size="md" />,
      component: <AnthropicSettings />,
    },
    {
      name: 'Gemini',
      key: 'gemini',
      icon: () => <ModelIcon type="gemini" size="md" />,
      component: <GeminiSettings />,
    },
  ];
  const allMenus = [...settingMenu, ...modelsMenu];
  const selectedMenuItem = allMenus.find((menu) => menu.key === selectedMenu);
  return (
    <SettingsContext.Provider value={{ open, dismiss }}>
      {children}
      <Dialog open={isSettingOpen} onOpenChange={setIsSettingOpen}>
        <DialogContent className="flex h-[96dvh] w-[96dvw] flex-col overflow-hidden rounded-xl border border-white/5 p-0 md:h-[600px] md:min-w-[800px] md:flex-row">
          <div className="absolute top-0 right-0 left-0 flex w-full flex-row gap-1 bg-black/5 p-2 md:bottom-0 md:w-[250px] md:flex-col md:gap-0 dark:bg-black/10">
            <p className="hidden px-2 py-2 font-semibold text-sm md:text-base text-zinc-500 md:flex">
              GENERAL
            </p>
            {settingMenu.map((menu) => (
              <Button
                variant={selectedMenu === menu.key ? 'secondary' : 'ghost'}
                key={menu.key}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start gap-2 px-2"
                size="default"
              >
                <div className="flex h-6 w-6 flex-row items-center justify-center">
                  {menu.icon()}
                </div>
                <span
                  className={cn(
                    'text-sm md:text-base md:flex',
                    selectedMenu === menu.key ? 'flex' : 'hidden'
                  )}
                >
                  {menu.name}
                </span>
              </Button>
            ))}
            <p className="hidden px-2 py-2 font-semibold text-sm md:text-base text-zinc-500 md:flex ">
              MODELS
            </p>
            {modelsMenu.map((menu) => (
              <Button
                variant={selectedMenu === menu.key ? 'secondary' : 'ghost'}
                key={menu.key}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start gap-2 px-2"
                size="default"
              >
                {menu.icon()}
                <span
                  className={cn(
                    'text-sm md:text-base md:flex',
                    selectedMenu === menu.key ? 'flex' : 'hidden'
                  )}
                >
                  {' '}
                  {menu.name}
                </span>
              </Button>
            ))}
          </div>
          <div className="no-scrollbar mt-[60px] h-full w-full overflow-y-auto md:mt-0 md:ml-[250px]">
            {selectedMenuItem?.component}
          </div>
        </DialogContent>
      </Dialog>
    </SettingsContext.Provider>
  );
};
