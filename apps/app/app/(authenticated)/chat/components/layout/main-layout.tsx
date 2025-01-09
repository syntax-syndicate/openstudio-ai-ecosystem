'use client';

import { Sidebar } from '@/app/(authenticated)/chat/components/layout/sidebar';
import { Toaster } from '@repo/design-system/components/ui/toaster';
export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-[100dvh] w-full flex-row bg-zinc-100 dark:bg-zinc-800">
      <Sidebar />
      {children}
      <Toaster />
    </div>
  );
};
