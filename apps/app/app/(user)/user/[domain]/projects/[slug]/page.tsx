import { getProject } from '@/actions/projects';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import NavButton from '@/app/(organization)/minime/components/layout/nav-button';
import MDX from '@/app/(organization)/minime/components/markdown/mdx';
import { getUserByDomain } from '@repo/backend/auth/utils';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Icons } from '@repo/design-system/components/ui/icons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Protection from './protection';

export const revalidate = 60;

interface ProjectPageProps {
  params: { slug: string; domain: string };
}

// export async function generateMetadata({
//   params,
// }: ProjectPageProps): Promise<Metadata | null> {
//   const {domain} = await params;
//   const domain_decoded = decodeURIComponent(domain);
//   const user = await getUserByDomain(domain_decoded);
//   if (!user) {
//     return notFound();
//   }
//   const project = await getProject({
//     authorId: user.id,
//     slug: params.slug,
//     published: true,
//   });

//   if (!project) {
//     return notFound();
//   }

//   const path = `/projects/${project.slug}`;
//   return generateSEO({
//     title: project.title,
//     ...(!project.isProtected && {
//       description: project.seoDescription || project.description || undefined,
//     }),
//     image:
//       project.ogImage ||
//       `https://openstudio.tech/api/og/post?title=${project.title}&username=${user.user_metadata.username || getUserName(user)}${project.isProtected ? "&locked=true" : ""}`,
//     url: user.user_metadata.domain
//       ? `https://${user.user_metadata.domain}${path}`
//       : `https://${user.user_metadata.username}.${process.env.NEXT_PUBLIC_USER_DOMAIN}${path}`,
//   });
// }

// export async function generateStaticParams({ params }: ProjectPageProps) {
//   const {domain} = await params;
//   const domain_decoded = decodeURIComponent(domain);
//   const user = await getUserByDomain(domain_decoded);
//   const projects = await getProjectsByAuthor(user?.id as string);

//   return projects.map((project) => ({
//     slug: project.slug,
//   }));
// }

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { domain, slug } = await params;
  const domain_decoded = decodeURIComponent(domain);
  const user = await getUserByDomain(domain_decoded);
  if (!user) {
    return notFound();
  }
  const project = await getProject({
    authorId: user.id,
    slug,
    published: true,
  });

  if (!project) {
    return notFound();
  }
  const Content = (
    <AppShell>
      <GoBack />
      <AppHeader
        title={project.title}
        className="flex-row items-center justify-normal gap-1 [&_.title]:text-xl"
      >
        {project.url && (
          <Link
            href={project.url}
            className="text-gray-4 transition-colors hover:text-secondary"
            target="_blank"
            aria-label={`Go to ${project.title}`}
          >
            <Icons.arrowUpRight size={18} />
          </Link>
        )}
      </AppHeader>
      <div className="mb-4 flex w-full flex-1 items-center justify-between text-gray-4 text-sm">
        <p>{project.description}</p>
        <Badge className="bg-inherit font-medium text-secondary ">
          {project.year}
        </Badge>
      </div>
      <MDX source={project.content} />
      <div className="mt-5 max-md:hidden">
        <GoBack />
      </div>
    </AppShell>
  );

  if (project.isProtected) {
    return (
      <Protection project={project} user={user}>
        {Content}
      </Protection>
    );
  }

  return Content;
}

function GoBack() {
  return (
    <NavButton
      variant="text"
      className="flex-row-reverse"
      href="/projects"
      icon="arrowLeft"
      aria-label="Back to Projects"
    >
      Back to Projects
    </NavButton>
  );
}
