import '@repo/design-system/styles/globals.css';
import { interVar } from '@/lib/fonts';
import { DesignSystemProvider } from '@repo/design-system';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Open Studio - ChatHub',
  description:
    'OpenStudio - App of Apps, Your gateway to AI Powered Applications',
};

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(interVar.variable, 'antialiased', 'light')}
    suppressHydrationWarning
  >
    <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
    </head>
    <body>
      <DesignSystemProvider>{children}</DesignSystemProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
