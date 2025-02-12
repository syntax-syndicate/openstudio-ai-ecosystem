import '@repo/design-system/styles/globals.css';
import { AnalyticsProvider } from '@repo/analytics';
// import './styles/web.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { CallToAction } from './components/cta';
import { Footer } from './components/footer';
import { Navbar } from './components/navbar';
type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, 'scroll-smooth')}
    suppressHydrationWarning
  >
    <body className="min-h-screen bg-backdrop">
      <AnalyticsProvider>
        <DesignSystemProvider>
          <Navbar />
          <main className="divide-y divide-gray-700">
            {children}
            <CallToAction />
            <Footer />
          </main>
        </DesignSystemProvider>
      </AnalyticsProvider>
      <Toolbar />
    </body>
  </html>
);

export default RootLayout;
