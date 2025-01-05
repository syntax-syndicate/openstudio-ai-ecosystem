import { MainLayout } from '@/app/(authenticated)/chat/components/layout/main-layout';
import { Header } from '@/app/(authenticated)/components/header';
import {
  AssistantsProvider,
  ChatProvider,
  ConfirmProvider,
  FiltersProvider,
  PreferenceProvider,
  PromptsProvider,
  ReactQueryProvider,
  SessionsProvider,
  SettingsProvider,
} from '@/app/context'; // Consolidated context imports
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
            <ConfirmProvider>
              <PreferenceProvider>
                <SessionsProvider>
                  <SettingsProvider>
                    <ChatProvider>
                      <FiltersProvider>
                        <AssistantsProvider>
                          <PromptsProvider>
                            <MainLayout>{children}</MainLayout>
                          </PromptsProvider>
                        </AssistantsProvider>
                      </FiltersProvider>
                    </ChatProvider>
                  </SettingsProvider>
                </SessionsProvider>
              </PreferenceProvider>
            </ConfirmProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </>
  );
}
