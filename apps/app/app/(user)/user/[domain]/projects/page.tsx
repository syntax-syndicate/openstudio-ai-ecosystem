import { getProjectsByAuthor } from '@/actions/projects';
import AppHeader from '@/app/(organization)/minime/components/layout/app-header';
import AppShell from '@/app/(organization)/minime/components/layout/app-shell';
import NoProjectsPlaceholder from '@/app/(organization)/minime/components/projects/no-projects-placeholder';
import Project from '@/app/(organization)/minime/components/projects/project';
import { getUserByDomain } from '@repo/backend/auth/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Projects',
};

interface ProjectPageProps {
  params: {
    domain: string;
  };
}

export default async function ProjectsPage({ params }: ProjectPageProps) {
  const { domain } = await params;
  const domain_decoded = decodeURIComponent(domain);
  const user = await getUserByDomain(domain_decoded);
  if (!user) {
    return notFound();
  }
  const projects = await getProjectsByAuthor(user.id);
  return (
    <AppShell>
      <AppHeader title="Projects" />
      <div>
        {projects.map((project) => (
          <Project project={project} key={project.id} url="/projects" />
        ))}
        {!projects.length && <NoProjectsPlaceholder />}
      </div>
    </AppShell>
  );
}
