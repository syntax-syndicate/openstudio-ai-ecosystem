import { MainLayout } from '@/app/(authenticated)/chat/components/main-layout';
import { Header } from '@/app/(authenticated)/components/header';
import { BotsProvider } from '@/app/context/bots/provider';
import { ChatProvider } from '@/app/context/chat/provider';
import { FiltersProvider } from '@/app/context/filters/provider';
import { PromptsProvider } from '@/app/context/prompts/provider';
import { ReactQueryProvider } from '@/app/context/react-query/provider';
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
        <ReactQueryProvider>
          <TooltipProvider>
            <SettingsProvider>
              <ChatProvider>
                <FiltersProvider>
                  <BotsProvider>
                    <PromptsProvider>
                      <MainLayout>{children}</MainLayout>
                    </PromptsProvider>
                  </BotsProvider>
                </FiltersProvider>
              </ChatProvider>
            </SettingsProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </>
  );
}
