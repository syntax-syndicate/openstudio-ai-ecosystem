'use client';

import { ModelIcon } from '@/app/(authenticated)/chat/components/icons/model-icon';
import { AnthropicSettings } from '@/app/(authenticated)/chat/components/settings/anthropic';
import { CommonSettings } from '@/app/(authenticated)/chat/components/settings/common';
import { Data } from '@/app/(authenticated)/chat/components/settings/data';
import { GeminiSettings } from '@/app/(authenticated)/chat/components/settings/gemini';
import { OllamaSettings } from '@/app/(authenticated)/chat/components/settings/ollama';
import { OpenAISettings } from '@/app/(authenticated)/chat/components/settings/openai';
import { WebSearchPlugin } from '@/app/(authenticated)/chat/components/settings/plugins/web-search';
import { VoiceInput } from '@/app/(authenticated)/chat/components/settings/voice-input';
import { SettingsContext } from '@/app/context/settings/context';
import { Database, GearSix, Microphone } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { Type } from '@repo/design-system/components/ui/text';
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
    {
      name: 'Voice Input',
      icon: () => <Microphone size={16} weight="bold" />,
      key: 'voice-input',
      component: <VoiceInput />,
    },
    {
      name: 'Data',
      icon: () => <Database size={16} weight="bold" />,
      key: 'Your Data',
      component: <Data />,
    },
  ];

  const modelsMenu: TSettingMenuItem[] = [
    {
      name: 'OpenAI',
      key: 'openai',
      icon: () => <ModelIcon size="sm" type="openai" />,
      component: <OpenAISettings />,
    },
    {
      name: 'Anthropic',
      key: 'anthropic',
      icon: () => <ModelIcon size="sm" type="anthropic" />,
      component: <AnthropicSettings />,
    },
    {
      name: 'Gemini',
      key: 'gemini',
      icon: () => <ModelIcon size="sm" type="gemini" />,

      component: <GeminiSettings />,
    },
    {
      name: 'Ollama',
      key: 'ollama',
      icon: () => <ModelIcon size="sm" type="ollama" />,
      component: <OllamaSettings />,
    },
  ];
  const pluginsMenu: TSettingMenuItem[] = [
    {
      name: 'Web Search',
      key: 'web-search',
      icon: () => <ModelIcon size="sm" type="websearch" />,
      component: <WebSearchPlugin />,
    },
  ];

  const allMenus = [...settingMenu, ...modelsMenu, ...pluginsMenu];
  const selectedMenuItem = allMenus.find((menu) => menu.key === selectedMenu);

  return (
    <SettingsContext.Provider value={{ open, dismiss }}>
      {children}

      <Dialog open={isSettingOpen} onOpenChange={setIsSettingOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:h-[600px] md:min-w-[800px]">
          <div className="w-full border-zinc-500/20 border-b px-4 py-3">
            <p className="font-medium text-md">Settings</p>
          </div>
          <div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
            <div className="no-scrollbar absolute top-0 right-0 left-0 flex w-full flex-row gap-1 overflow-x-auto border-zinc-500/10 px-2 pt-2 pb-2 md:bottom-0 md:h-full md:w-[250px] md:flex-col md:gap-0 md:overflow-y-auto md:border-r md:pb-16">
              <Type
                size="xxs"
                textColor="tertiary"
                className="hidden p-2 md:flex"
                weight="medium"
              >
                GENERAL
              </Type>
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
                      'font-medium text-xs md:flex md:text-sm',
                      selectedMenu === menu.key ? 'flex' : 'hidden'
                    )}
                  >
                    {menu.name}
                  </span>
                </Button>
              ))}
              <Type
                size="xxs"
                textColor="tertiary"
                className="hidden p-2 md:flex"
                weight="medium"
              >
                MODELS
              </Type>{' '}
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
                      'font-medium text-xs md:flex md:text-sm',
                      selectedMenu === menu.key ? 'flex' : 'hidden'
                    )}
                  >
                    {' '}
                    {menu.name}
                  </span>
                </Button>
              ))}
              <Type
                size="xxs"
                textColor="tertiary"
                className="hidden p-2 md:flex"
                weight="medium"
              >
                PLUGINS
              </Type>{' '}
              {pluginsMenu.map((menu) => (
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
                      'font-medium text-xs md:flex md:text-sm',
                      selectedMenu === menu.key ? 'flex' : 'hidden'
                    )}
                  >
                    {' '}
                    {menu.name}
                  </span>
                </Button>
              ))}
            </div>
            <div className="no-scrollbar mt-12 h-full w-full overflow-y-auto pb-16 md:mt-0 md:ml-[250px]">
              {selectedMenuItem?.component}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsContext.Provider>
  );
};
