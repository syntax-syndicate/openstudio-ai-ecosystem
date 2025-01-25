import Project from '@/app/(organization)/minime/components/projects/project';
import type { Project as ProjectProps } from '@/helper/utils';
import { Icons } from '@repo/design-system/components/ui/icons';
import Link from 'next/link';

type ProjectType = Omit<ProjectProps, 'password'> & { isProtected: boolean };

export default function Projects({ projects }: { projects: ProjectType[] }) {
  if (!projects.length) {
    return null;
  }
  return (
    <dl className="section-container">
      <dt className="section-title link group">
        <Link
          href="/projects"
          className="absolute h-full w-full "
          aria-label="View All Projects"
        />
        <h3>Projects</h3>
        <Icons.arrowRight
          size={16}
          className="text-gray-4 group-hover:text-secondary"
        />
      </dt>
      <dd className="section-content">
        {projects.map((project) => (
          <Project project={project} key={project.id} url="/projects" />
        ))}
      </dd>
    </dl>
  );
}
