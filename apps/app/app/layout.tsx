import '@repo/design-system/styles/globals.css';
import { interVar } from '@/lib/fonts';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, `${interVar.variable} font-sans`, 'antialiased')}
    suppressHydrationWarning
  >
    <body>
      <DesignSystemProvider>{children}</DesignSystemProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
