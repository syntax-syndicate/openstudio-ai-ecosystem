'use client';
import { CommonSettings } from '@/app/(authenticated)/chat/components/settings/common';
import { Data } from '@/app/(authenticated)/chat/components/settings/data';
import { ModelSettings } from '@/app/(authenticated)/chat/components/settings/models';
import { PulginSettings } from '@/app/(authenticated)/chat/components/settings/plugins';
import { VoiceInput } from '@/app/(authenticated)/chat/components/settings/voice-input';
import {
  DashboardCircleIcon,
  Database02Icon,
  Settings03Icon,
  SparklesIcon,
  VoiceIcon,
} from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { cn } from '@repo/design-system/lib/utils';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export type TSettingsContext = {
  open: (menu?: string) => void;
  dismiss: () => void;
};
export const SettingsContext = createContext<undefined | TSettingsContext>(
  undefined
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingssProvider');
  }
  return context;
};

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
      icon: () => <Settings03Icon size={18} strokeWidth="2" />,
      key: 'common',
      component: <CommonSettings />,
    },
    {
      name: 'Models',
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
      name: 'Voice Input',
      icon: () => <VoiceIcon size={18} strokeWidth="2" />,
      key: 'voice-input',
      component: <VoiceInput />,
    },
    {
      name: 'Data',
      icon: () => <Database02Icon size={18} strokeWidth="2" />,
      key: 'Your Data',
      component: <Data />,
    },
  ];

  const selectedMenuItem = settingMenu.find(
    (menu) => menu.key === selectedMenu
  );

  return (
    <SettingsContext.Provider value={{ open, dismiss }}>
      {children}

      <Dialog open={isSettingOpen} onOpenChange={setIsSettingOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:h-[600px] md:min-w-[800px]">
          <div className="w-full border-zinc-500/20 border-b px-4 py-3">
            <p className="font-medium text-md">Settings</p>
          </div>
          <div className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
            <div className="no-scrollbar absolute top-0 right-0 left-0 flex w-full flex-row gap-1 overflow-x-auto border-zinc-500/10 px-2 pt-2 pb-2 md:bottom-0 md:h-full md:w-[220px] md:flex-col md:gap-0 md:overflow-y-auto md:pb-16">
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
            </div>
            <div className="no-scrollbar mt-12 h-full w-full overflow-y-auto pb-16 md:mt-0 md:ml-[220px]">
              {selectedMenuItem?.component}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SettingsContext.Provider>
  );
};
