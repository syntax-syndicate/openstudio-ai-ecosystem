import Article from '@/app/(organization)/minime/components/articles/article';
import type { Article as ArticleProps } from '@/helper/utils';
import { Icons } from '@repo/design-system/components/ui/icons';
import Link from 'next/link';

export default function Articles({ articles }: { articles: ArticleProps[] }) {
  if (!articles.length) {
    return null;
  }

  return (
    <dl className="section-container">
      <dt className="section-title link group">
        <Link
          href="/articles"
          className="absolute h-full w-full"
          aria-label="View All Articles"
        />
        <h3>Writing</h3>
        <Icons.arrowRight
          size={16}
          className="text-gray-4 group-hover:text-secondary"
        />
      </dt>

      <dd className="section-content">
        {articles.map((article) => (
          <Article article={article} key={article.id} url="/articles" />
        ))}
      </dd>
    </dl>
  );
}
