import { getArticlesByAuthor } from '@/actions/articles';
import Article from '@/app/(organization)/minime/components/articles/article';
import NoArticlesPlaceholder from '@/app/(organization)/minime/components/articles/no-articles-placeholder';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import { currentUser } from '@repo/backend/auth/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Writing',
};
interface ArticlesPageProps {
  params: {
    domain: string;
  };
}
export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { domain } = await params;
  const domain_decoded = decodeURIComponent(domain);
  //   const user = await getUserByDomain(domain);
  const user = await currentUser();
  if (!user) {
    return notFound();
  }
  const articles = await getArticlesByAuthor(user.id);

  return (
    <AppShell>
      <AppHeader title="Articles">
        {/* <Subscribe username={user.user_metadata.username} newsletter={user.user_metadata.newsletter} /> */}
      </AppHeader>
      <div>
        {articles.map((article) => (
          <Article article={article} key={article.id} />
        ))}
        {!articles.length && <NoArticlesPlaceholder />}
      </div>
    </AppShell>
  );
}
