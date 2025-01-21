import { RootLayout } from '@/app/(organization)/chat/components/layout';
import { PreferenceProvider, SessionsProvider } from '@/context'; // Consolidated context imports
import { RootProvider } from '@/context/root';
import { TooltipProvider } from '@repo/design-system/components/ui/tooltip';
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
    <RootProvider>
      <TooltipProvider>
        <PreferenceProvider>
          <SessionsProvider>
            <RootLayout>{children}</RootLayout>
          </SessionsProvider>
        </PreferenceProvider>
      </TooltipProvider>
    </RootProvider>
  );
}
