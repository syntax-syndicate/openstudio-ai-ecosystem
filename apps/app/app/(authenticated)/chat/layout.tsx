import { RootLayout } from '@/app/(authenticated)/chat/components/layout';
import {
  PreferenceProvider,
  ReactQueryProvider,
  SessionsProvider,
} from '@/context'; // Consolidated context imports
import { RootProvider } from '@/context/root';
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
      <RootProvider>
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
                  <RootLayout>{children}</RootLayout>
                </SessionsProvider>
              </PreferenceProvider>
            </TooltipProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </RootProvider>
    </>
  );
}
