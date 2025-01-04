import { MainLayout } from '@/app/(authenticated)/chat/components/main-layout';
import { Header } from '@/app/(authenticated)/components/header';
import { ChatProvider } from '@/app/context/chat/provider';
import { FiltersProvider } from '@/app/context/filters/provider';
import { SettingsProvider } from '@/app/context/settings/provider';
import { TooltipProvider } from '@repo/design-system/components/ui/tooltip';
import { ThemeProvider } from '@repo/design-system/providers/theme';

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header pages={['Conversation']} page="Chat Sessions"></Header>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <SettingsProvider>
            <ChatProvider>
              <FiltersProvider>
                <MainLayout>{children}</MainLayout>
              </FiltersProvider>
            </ChatProvider>
          </SettingsProvider>
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
