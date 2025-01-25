// import Upgrade from "@/app/(organization)/minime/components/shared/upgrade";
import { getArticleById } from '@/actions/articles';
import Analytics from '@/app/(organization)/minime/components/analytics';
import AnalyticsSkeleton from '@/app/(organization)/minime/components/analytics/skeleton';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Analytics',
};

interface Props {
  params: {
    articleId: string;
  };
}

export default async function ArticleAnalytics({ params }: Props) {
  const { articleId } = await params;
  const [article] = await Promise.all([getArticleById(articleId)]);

  if (!article) {
    return notFound();
  }
  //TODO: add plan check
  //   if (!plan.isPro) {
  //     return <Upgrade className="relative py-10" />;
  //   }

  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <Analytics
        basePath={`/api/articles/${article[0].id}`}
        title="Article analytics"
        index="views"
      />
    </Suspense>
  );
}
