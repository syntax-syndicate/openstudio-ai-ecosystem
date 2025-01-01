'use client';

import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { AnthropicSettings } from '@/app/(authenticated)/chat/components/settings/anthropic';
import { OpenAISettings } from '@/app/(authenticated)/chat/components/settings/openai';
import { GearSix } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useChatContext } from '../chat/context';
import { SettingsContext } from './context';

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
  const { sessions, createSession } = useChatContext();
  const router = useRouter();
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const open = () => setIsSettingOpen(true);
  const dismiss = () => setIsSettingOpen(false);
  const settingMenu: TSettingMenuItem[] = [
    {
      name: 'Profile',
      icon: () => <GearSix size={16} weight="bold" />,
      key: 'profile',
      component: <div>Profile</div>,
    },
    {
      name: 'Prompts',
      key: 'prompts',
      icon: () => <GearSix size={16} weight="bold" />,
      component: <div>Prompts</div>,
    },
    {
      name: 'Roles',
      key: 'roles',
      icon: () => <GearSix size={16} weight="bold" />,
      component: <div>Roles</div>,
    },
  ];
  const modelsMenu: TSettingMenuItem[] = [
    {
      name: 'OpenAI',
      key: 'open-ai',
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
      component: <div>Gemini</div>,
    },
  ];
  const allMenus = [...settingMenu, ...modelsMenu];
  const selectedMenuItem = allMenus.find((menu) => menu.key === selectedMenu);
  return (
    <SettingsContext.Provider value={{ open, dismiss }}>
      {children}
      <Dialog open={isSettingOpen} onOpenChange={setIsSettingOpen}>
        <DialogContent className="flex min-h-[80vh] min-w-[800px] flex-row overflow-hidden border border-white/5 p-0">
          <div className="absolute top-0 bottom-0 left-0 flex w-[250px] flex-col bg-black/10 p-2">
            <p className="px-4 py-2 font-semibold text-white/30 text-xs">
              GENERAL
            </p>
            {settingMenu.map((menu) => (
              <Button
                variant={selectedMenu === menu.key ? 'secondary' : 'ghost'}
                key={menu.key}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start gap-3 px-3"
                size="default"
              >
                {menu.icon()}
                {menu.name}
              </Button>
            ))}
            <p className="px-4 py-2 font-semibold text-white/30 text-xs">
              MODELS
            </p>
            {modelsMenu.map((menu) => (
              <Button
                variant={selectedMenu === menu.key ? 'secondary' : 'ghost'}
                key={menu.key}
                onClick={() => setSelectedMenu(menu.key)}
                className="justify-start gap-3 px-3"
                size="default"
              >
                {menu.icon()}
                {menu.name}
              </Button>
            ))}
          </div>
          <div className="ml-[250px] h-full w-full">
            {selectedMenuItem?.component}
          </div>
        </DialogContent>
      </Dialog>
    </SettingsContext.Provider>
  );
};
