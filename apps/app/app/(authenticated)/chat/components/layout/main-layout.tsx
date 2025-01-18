'use client';

import { ApiKeyModal } from '@/app/(authenticated)/chat/components/api-key-modal';
import { CommandSearch } from '@/app/(authenticated)/chat/components/command-search';
import { HistorySidebar } from '@/app/(authenticated)/chat/components/history/history-side-bar';
import { SettingsSidebar } from '@/app/(authenticated)/chat/components/layout/settings-sidebar';
import { Sidebar } from '@/app/(authenticated)/chat/components/layout/sidebar';
import { useRootContext } from '@/context/root';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Toaster } from '@repo/design-system/components/ui/toaster';
import { cn } from '@repo/design-system/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const { isSidebarOpen } = useRootContext();
  const isChatPage = pathname.startsWith('/chat');
  const isSettingsPage = pathname.startsWith('/chat/settings');
  const mainContainerClass =
    'relative flex flex-1 flex-col h-[99dvh] w-full overflow-hidden rounded-t-lg bg-zinc-25 shadow-sm dark:border dark:border-white/5 dark:bg-zinc-800';
  const settingsContainerClass =
    'overflow-hidden h-[98dvh] rounded-t-md bg-white shadow-sm dark:border dark:border-white/5 dark:bg-zinc-800';
  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-start bg-white md:flex-row dark:bg-zinc-800">
      <div className="flex min-h-[100dvh] w-full flex-col overflow-hidden bg-zinc-50 md:flex-row dark:bg-zinc-900">
        <Sidebar />
        <Flex className="flex-1 gap-0 overflow-hidden">
          <AnimatePresence>
            {isChatPage && isSidebarOpen && (
              <motion.div
                key="history-sidebar"
                layoutId="sidebar"
                initial={{ width: 0, opacity: 1 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HistorySidebar />
              </motion.div>
            )}
          </AnimatePresence>
          {isSettingsPage && <SettingsSidebar />}
          <motion.div className="flex-1 pt-2 pr-2">
            <div
              className={cn(
                isSettingsPage ? settingsContainerClass : mainContainerClass
              )}
            >
              {children}
            </div>
          </motion.div>
          <ApiKeyModal />
          <CommandSearch />
        </Flex>
        <Toaster />
      </div>
    </div>
  );
};
