'use client';
import { tailwind } from '@repo/tailwind-config';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import type { ThemeProviderProps } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <TooltipProvider>{children}</TooltipProvider>
    <Toaster />
    <ProgressBar
      height="2px"
      color={tailwind.theme.colors.red[500]}
      options={{ showSpinner: false }}
      shallowRouting
    />
  </ThemeProvider>
);
