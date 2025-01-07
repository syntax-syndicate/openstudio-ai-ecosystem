import { MainLayout } from '@/app/(authenticated)/chat/components/layout/main-layout';
import { Header } from '@/app/(authenticated)/components/header';
import {
  AssistantsProvider,
  ChatProvider,
  CommandsProvider,
  PreferenceProvider,
  PromptsProvider,
  ReactQueryProvider,
  SessionsProvider,
  SettingsProvider,
} from '@/context'; // Consolidated context imports
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
            <PreferenceProvider>
              <SessionsProvider>
                <SettingsProvider>
                  <ChatProvider>
                    <CommandsProvider>
                      <AssistantsProvider>
                        <PromptsProvider>
                          <MainLayout>{children}</MainLayout>
                        </PromptsProvider>
                      </AssistantsProvider>
                    </CommandsProvider>
                  </ChatProvider>
                </SettingsProvider>
              </SessionsProvider>
            </PreferenceProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </>
  );
}
