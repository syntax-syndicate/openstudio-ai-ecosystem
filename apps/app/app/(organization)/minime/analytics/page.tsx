import Analytics from '@/app/(organization)/minime/components/analytics';
import AnalyticsSkeleton from '@/app/(organization)/minime/components/analytics/skeleton';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import { currentUser } from '@repo/backend/auth/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default async function Overview() {
  const [user] = await Promise.all([currentUser()]);

  if (!user) {
    return notFound();
  }

  //TODO: focus on adding this later
  //   if (!plan.isPro) {
  //     return <Upgrade className="relative py-10" />;
  //   }
  return (
    <AppShell>
      <Suspense fallback={<AnalyticsSkeleton pages />}>
        <Analytics basePath="/api" title="Analytics" pages />
      </Suspense>
    </AppShell>
  );
}
