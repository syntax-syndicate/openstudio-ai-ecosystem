
import type { Viewport } from 'next';
import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { SidebarInset } from '@repo/design-system/components/ui/sidebar';
import { AppSidebar } from '@/app/(organization)/chatv2/components/v2/app-sidebar';
import Script from 'next/script';
import { currentUser } from '@repo/backend/auth/utils';
import { cookies } from 'next/headers';
import { PreferenceProvider } from '@/context';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <PreferenceProvider>
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={user!} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
      </PreferenceProvider>
    </>
  );
}
