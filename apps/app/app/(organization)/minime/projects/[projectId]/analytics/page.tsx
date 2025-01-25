import { getProjectById } from '@/actions/projects';
import Analytics from '@/app/(organization)/minime/components/analytics';
import AnalyticsSkeleton from '@/app/(organization)/minime/components/analytics/skeleton';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Analytics',
};

export default async function ProjectAnalytics({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = await params;
  const [project] = await Promise.all([getProjectById(projectId)]);

  if (!project) {
    return notFound();
  }

  //TODO: add plan check
  //   if (!plan.isPro) {
  //     return <Upgrade className="relative py-10" />;
  //   }

  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <Analytics
        basePath={`/api/projects/${project[0].id}`}
        title="Project analytics"
        index="views"
      />
    </Suspense>
  );
}
