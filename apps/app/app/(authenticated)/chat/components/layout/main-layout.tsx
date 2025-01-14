'use client';

import { Navbar } from '@/app/(authenticated)/chat/components/layout/navbar';
import { Toaster } from '@repo/design-system/components/ui/toaster';
export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col justify-start bg-zinc-25 md:flex-row dark:bg-zinc-800">
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
};
