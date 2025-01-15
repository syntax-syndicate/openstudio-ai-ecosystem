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
  openGraph: {
    title: 'Open Studio - ChatHub | AI-Powered Innovation Hub',
    siteName: 'Open Studio',
    description: 'Experience the future of AI applications in one unified platform. Open Studio brings you a seamless gateway to cutting-edge AI tools and services.',
    url: 'https://openstudio.tech',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Studio - ChatHub | AI Innovation Platform',
    site: 'openstudio.tech',
    description: 'Discover a world of AI possibilities with Open Studio. Your all-in-one platform for accessing and interacting with advanced AI applications.',
  },
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
