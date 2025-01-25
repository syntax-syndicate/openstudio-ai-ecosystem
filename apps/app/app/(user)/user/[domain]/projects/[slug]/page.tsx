import AppShell from "@/app/(organization)/minime/components/layout/app-shell";
import AppHeader from "@/app/(organization)/minime/components/layout/app-header";
import NavButton from "@/app/(organization)/minime/components/layout/nav-button";
import MDX from "@/app/(organization)/minime/components/markdown/mdx";
import { Icons } from "@repo/design-system/components/ui/icons";
import { Badge } from "@repo/design-system/components/ui/badge";
import { getProject, getProjectsByAuthor } from "@/actions/projects";
import { getUserByDomain } from "@repo/backend/auth/utils";
import { generateSEO } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Protection from "./protection";
import { getUserName } from "@repo/backend/auth/format";

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
  const {domain} = await params;
  const domain_decoded = decodeURIComponent(domain);
  const user = await getUserByDomain(domain_decoded);
  if (!user) {
    return notFound();
  }
  const project = await getProject({
    authorId: user.id,
    slug: params.slug,
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
        className="flex-row items-center justify-normal gap-1  [&_.title]:text-xl"
      >
        {project.url && (
          <Link
            href={project.url}
            className="text-gray-4 hover:text-secondary transition-colors"
            target="_blank"
            aria-label={`Go to ${project.title}`}
          >
            <Icons.arrowUpRight size={18} />
          </Link>
        )}
      </AppHeader>
      <div className="w-full flex-1 text-sm text-gray-4 flex items-center justify-between mb-4">
        <p>{project.description}</p>
        <Badge className="text-secondary bg-inherit font-medium ">
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
