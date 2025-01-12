'use client';

import { Sidebar } from '@/app/(authenticated)/chat/components/layout/sidebar';
import { Toaster } from '@repo/design-system/components/ui/toaster';
export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-start md:flex-row dark:bg-zinc-800">
      <Sidebar />
      {children}
      <Toaster />
    </div>
  );
};
