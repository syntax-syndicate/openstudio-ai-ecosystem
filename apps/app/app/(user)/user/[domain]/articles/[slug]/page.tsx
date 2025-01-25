import { getArticle } from '@/actions/articles';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import NavButton from '@/app/(organization)/minime/components/layout/nav-button';
import MDX from '@/app/(organization)/minime/components/markdown/mdx';
import { formatDate } from '@/helper/utils';
import { getUserByDomain } from '@repo/backend/auth/utils';
import moment from 'moment';
import { notFound } from 'next/navigation';
import readingTime from 'reading-time';
export const revalidate = 60;

interface ArticlePageProps {
  params: { slug: string; domain: string };
}

// export async function generateMetadata({
//   params,
// }: ArticlePageProps): Promise<Metadata | null> {
//   const { domain, slug } = await params;
//   const domain_decoded = decodeURIComponent(domain);
//   const user = await getUserByDomain(domain_decoded);
//   if (!user) {
//     return notFound();
//   }

//   const article = await getArticle({
//     authorId: user.id,
//     slug: slug,
//     published: true,
//   });

//   if (!article) {
//     return notFound();
//   }

//   const path = `/articles/${article[0].slug}`;
//   return generateSEO({
//     title: article[0].title,
//     description: article[0].seoDescription || undefined,
//     image:
//       article[0].ogImage ||
//       `https://openstudio.tech/api/og/post?title=${article[0].title}&username=${user.user_metadata.username}`,
//     canonicalURL: article[0].canonicalURL || undefined,
//     url: user.user_metadata.domain
//       ? `https://${user.user_metadata.domain}${path}`
//       : `https://${user.user_metadata.username}.${process.env.NEXT_PUBLIC_USER_DOMAIN}${path}`,
//   });
// }

// export async function generateStaticParams({ params }: ArticlePageProps) {
//   const { domain, slug } = await params;
//   const domain_decoded = decodeURIComponent(domain);
//   const user = await getUserByDomain(domain_decoded);
//   const articles = await getArticlesByAuthor(user?.id as string);

//   return articles.map((article) => ({
//     slug: article.slug,
//   }));
// }

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { domain, slug } = await params;
  const domain_decoded = decodeURIComponent(domain);
  const user = await getUserByDomain(domain_decoded);
  if (!user) {
    return notFound();
  }
  const article = await getArticle({
    authorId: user.id,
    slug: slug,
    published: true,
  });

  if (!article) {
    return notFound();
  }
  return (
    <AppShell>
      <GoBack />
      <AppHeader
        title={article[0].title}
        className="mb-4 flex-col items-start gap-2 [&_.title]:text-xl"
      >
        <div className="flex w-full flex-row items-center justify-between gap-2 text-gray-4 text-sm">
          <div className="flex items-center gap-2">
            <p>
              {`${formatDate(article[0].publishedAt)} ( ${moment(article[0].publishedAt).fromNow()} )`}
            </p>
            <span>•</span>
            <p>{readingTime(article[0].content as string).text}</p>
          </div>
          <span>{article[0].views} views</span>
        </div>
      </AppHeader>
      <MDX source={article[0].content} />
      <div className="mt-5 max-md:hidden">
        <GoBack />
      </div>
    </AppShell>
  );
}

function GoBack() {
  return (
    <NavButton
      variant="text"
      className="flex-row-reverse"
      href="/articles"
      icon="arrowLeft"
      aria-label="Back to Articles"
    >
      Back to Articles
    </NavButton>
  );
}
