'use client';

import { Toaster } from '@repo/design-system/components/ui/toaster';

export type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen w-full flex-row bg-zinc-white dark:bg-zinc-800">
      {children}
      <Toaster />
    </div>
  );
};
