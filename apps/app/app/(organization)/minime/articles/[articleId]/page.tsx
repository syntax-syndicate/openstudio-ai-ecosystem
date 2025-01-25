import { getArticleById } from '@/actions/articles';
import EditorPage from '@/app/(organization)/minime/components/editor/page';
import EditorSkeleton from '@/app/(organization)/minime/components/editor/skeleton';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import { currentUser } from '@repo/backend/auth/utils';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface EditorPageProps {
  params: { articleId: string };
}

export async function generateMetadata({ params }: EditorPageProps) {
  const { articleId } = await params;
  const article = await getArticleById(articleId);
  if (!article) {
    return notFound();
  }

  return {
    title: article[0].title,
  };
}

export default async function ArticleEditorPage({ params }: EditorPageProps) {
  const { articleId } = await params;
  const [user, article] = await Promise.all([
    currentUser(),
    getArticleById(articleId),
  ]);
  if (!article || !user) {
    return notFound();
  }

  return (
    <AppShell>
      <Suspense fallback={<EditorSkeleton />}>
        <EditorPage type="articles" post={article[0]} user={user} />
      </Suspense>
    </AppShell>
  );
}
