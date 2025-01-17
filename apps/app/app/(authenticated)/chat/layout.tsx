import { MainLayout } from '@/app/(authenticated)/chat/components/layout/main-layout';
import {
  PreferenceProvider,
  ReactQueryProvider,
  SessionsProvider,
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
      {/* <Header pages={['']} page=""></Header> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ReactQueryProvider>
          <TooltipProvider>
            <PreferenceProvider>
              <SessionsProvider>
                <MainLayout>{children}</MainLayout>
              </SessionsProvider>
            </PreferenceProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </ThemeProvider>
    </>
  );
}
