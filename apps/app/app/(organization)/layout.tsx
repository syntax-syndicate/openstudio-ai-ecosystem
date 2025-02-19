import { Sidebar } from '@/components/sidebar';
import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { SidebarProvider } from '@repo/design-system/components/ui/sidebar';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { Navbar } from './components/navbar';

type OrganizationLayoutProperties = {
  readonly children: ReactNode;
};

const OrganizationLayout = async ({
  children,
}: OrganizationLayoutProperties) => {
  const [user, organizationId] = await Promise.all([
    currentUser(),
    currentOrganizationId(),
  ]);

  if (!user) {
    redirect('/sign-in'); // TODO: Change to sign-in
  }

  if (!organizationId) {
    redirect('/setup');
  }

  const organization = await database
    .select()
    .from(schema.organization)
    .where(eq(schema.organization.id, organizationId));

  if (!organization) {
    throw new Error('Organization not found');
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider
        style={{
          // @ts-expect-error --sidebar-width is a custom property
          '--sidebar-width': '220px',
        }}
      >
        <Sidebar user={user} organization={organization[0]} />
        <main className="flex min-h-screen flex-1 flex-col">
          <Navbar />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
};

export default OrganizationLayout;
