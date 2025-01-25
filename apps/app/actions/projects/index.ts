'use server';

import { formatVerboseDate, jsonToFrontmatter } from '@/helper/utils';
import type {
  projectCreateSchema,
  projectPatchSchema,
} from '@/lib/validations/project';
import type { ExportResponse } from '@/types/minime';
import { currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { projects } from '@repo/backend/schema';
import { slugify } from '@repo/lib/src/slugify';
import { and, desc } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import type * as z from 'zod';

type ProjectCreateSchema = z.infer<typeof projectCreateSchema>;
type ProjectPatchSchema = z.infer<typeof projectPatchSchema>;

// get projects
export async function getProjects({
  limit,
  published,
}: {
  limit?: number;
  published?: boolean;
} = {}) {
  const user = await currentUser();
  return await database
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.authorId, user!.id),
        published !== undefined ? eq(projects.published, published) : undefined
      )
    )
    .limit(limit || 50) // Adding a default limit of 50 if none provided
    .orderBy(desc(projects.year));
}

// create project
export async function createProject(
  authorId: string,
  body: ProjectCreateSchema
) {
  const user = await currentUser();

  const project = await database
    .insert(projects)
    .values({
      organizationId: user!.user_metadata.organization_id,
      authorId,
      ...body,
      slug: slugify(body.title),
    })
    .returning();

  return project;
}

// update
export async function updateProject(
  projectId: string,
  authorId: string,
  body: ProjectPatchSchema
) {
  const user = await currentUser();
  const { slug, ...rest } = body;
  return await database
    .update(projects)
    .set({
      ...rest,
      //   slug: slug || slugify(body.title!),
    })
    .where(and(eq(projects.id, projectId), eq(projects.authorId, user!.id!)))
    .returning();
}

// delete project
export async function deleteProject(projectId: string, authorId: string) {
  const project = await database
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.authorId, authorId)))
    .returning();
  return project[0].id;
}

// verify project access
export async function verifyProjectAccess(projectId: string, authorId: string) {
  const result = await database
    .select({ count: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.authorId, authorId)));

  return result.length > 0;
}

// get project by id
export async function getProjectById(projectId: string) {
  const user = await currentUser();
  return await database
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.authorId, user!.id!)));
}

// export project
export async function getProjectExport(
  projectId: string,
  authorId: string
): Promise<ExportResponse> {
  const result = await database
    .select({
      id: projects.id,
      title: projects.title,
      slug: projects.slug,
      content: projects.content,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      year: projects.year,
      published: projects.published,
      views: projects.views,
      description: projects.description,
      url: projects.url,
      seoTitle: projects.seoTitle,
      seoDescription: projects.seoDescription,
      ogImage: projects.ogImage,
      password: projects.password,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.authorId, authorId)));

  if (result.length === 0) {
    throw new Error('Project not found');
  }

  const project = result[0];

  if (!(await verifyProjectAccess(project.id, authorId))) {
    throw new Error('Permission denied');
  }

  const filename = `openstudio_minime_export_project_${project.slug}.md`;
  const { content: projectContent, createdAt, updatedAt, ...props } = project;
  const frontmatter = jsonToFrontmatter({
    ...props,
    createdAt: formatVerboseDate(createdAt),
    updatedAt: formatVerboseDate(updatedAt),
  });
  const content = frontmatter + projectContent!;

  return {
    content,
    filename,
  };
}

// get projects export
export async function getProjectsExport(authorId: string) {
  const projectsData = await database
    .select()
    .from(projects)
    .where(eq(projects.authorId, authorId));

  const data = await Promise.all(
    projectsData.map(async (project) => getProjectExport(project.id, authorId))
  );
  return data;
}

export async function getProjectsByAuthor(
  authorId: string,
  limit?: number,
  published = true
) {
  const projectsData = await database
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.authorId, authorId),
        published ? eq(projects.published, published) : undefined
      )
    )
    .limit(limit || 50)
    .orderBy(desc(projects.year));

  const filteredProjects = projectsData.map((project) => {
    const { password, ...rest } = project;
    const isProtected = !!password;
    return {
      ...rest,
      isProtected,
    };
  });

  return filteredProjects;
}

// get project
export async function getProject({
  authorId,
  slug,
  published = true,
}: {
  authorId: string;
  slug: string;
  published?: boolean;
}) {
  const projectData = await database
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.authorId, authorId),
        eq(projects.slug, slug),
        eq(projects.published, published)
      )
    );

  if (projectData.length === 0) {
    return null;
  }

  const { password, ...rest } = projectData[0];
  const isProtected = !!password;

  return {
    ...rest,
    isProtected,
  };
}
