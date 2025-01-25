import EditorPage from "@/app/(organization)/minime/components/editor/page";
import EditorSkeleton from "@/app/(organization)/minime/components/editor/skeleton";
import AppShell from "@/app/(organization)/minime/components/layout/app-shell";
import { getProjectById } from "@/actions/projects";
import { currentUser } from "@repo/backend/auth/utils";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface ProjectEditorPageProps {
  params: { projectId: string };
}

export async function generateMetadata({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return notFound();
  }

  return {
    title: project[0].title,
  };
}

export default async function ProjectEditorPage({
  params,
}: ProjectEditorPageProps) {
  const { projectId } = await params;
  const [user, project] = await Promise.all([
    currentUser(),
    getProjectById(projectId),
  ]);

  if (!project || !user) {
    return notFound();
  }

  return (
    <AppShell>
      <Suspense fallback={<EditorSkeleton />}>
        <EditorPage type="projects" post={project[0]} user={user} />
      </Suspense>
    </AppShell>
  );
}
