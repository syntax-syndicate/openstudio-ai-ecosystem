import Article from '@/app/(organization)/minime/components/articles/article';
import NewArticle from '@/app/(organization)/minime/components/articles/article-create-button';
import NoArticlesPlaceholder from '@/app/(organization)/minime/components/articles/no-articles-placeholder';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import PostsFilter from '@/app/(organization)/minime/components/layout/posts-filter';
import { sortArticles } from '@/helper/utils';
import { getArticles } from '@/actions/articles';
import type { Metadata } from 'next';

interface Props {
  searchParams: {
    published?: 'true' | 'false';
  };
}
export const metadata: Metadata = {
  title: 'Articles',
};

export default async function Articles({ searchParams }: Props) {
  const { published } = await searchParams;
  const articles = await getArticles();
  const sortedArticles = sortArticles(articles, published);
  return (
    <AppShell>
      <AppHeader title="Articles">
        <NewArticle />
      </AppHeader>
      <PostsFilter segment="minime/articles" current={published} />
      <div>
        {sortedArticles.map((article) => (
          <Article article={article} key={article.id} admin />
        ))}
        {!sortedArticles.length && <NoArticlesPlaceholder description />}
      </div>
    </AppShell>
  );
}
