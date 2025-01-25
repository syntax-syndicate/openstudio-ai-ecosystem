import { getArticlesByAuthor } from '@/actions/articles';
import { getBookmarksByAuthor } from '@/actions/bookmarks';
import { getProjectsByAuthor } from '@/actions/projects';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import { getUserByDomain } from '@repo/backend/auth/utils';
import { notFound } from 'next/navigation';
import About from './components/about';
import Articles from './components/articles';
import Bookmarks from './components/bookmarks';
import Connect from './components/connect';
import Intro from './components/intro';
import { NothingPlaceholder } from './components/nothing-placeholder';
import Projects from './components/projects';

export const revalidate = 60;

interface PageProps {
  params: {
    domain: string;
  };
}

// export async function generateStaticParams() {
//   const allDomains = await getAllUserDomains();

//   const domains = allDomains
//     .flatMap(({ username, domain }) => [
//       domain
//         ? {
//             domain,
//           }
//         : {
//             domain: username,
//           },
//     ])
//     .filter(Boolean);

//   return domains;
// }

export default async function Home({ params }: PageProps) {
  const { domain } = await params;
  const domain_decoded = decodeURIComponent(domain);
  const user = await getUserByDomain(domain_decoded);
  if (!user) {
    return notFound();
  }
  const [articles, projects, bookmarks] = await Promise.all([
    getArticlesByAuthor(user.id, 5),
    getProjectsByAuthor(user.id, 5),
    getBookmarksByAuthor(user.id, 5),
  ]);
  return (
    <AppShell>
      <Intro user={user} />
      {!user?.user_metadata?.about?.trim().length &&
        !articles.length &&
        !projects.length && (
          <NothingPlaceholder name={user.user_metadata?.username} />
        )}
      <div className="flex flex-col gap-6">
        <About content={user.user_metadata?.about as string} />
        <Articles articles={articles} />
        <Projects projects={projects} />
        <Bookmarks bookmarks={bookmarks} />
        <Connect user={user} />
      </div>
    </AppShell>
  );
}
