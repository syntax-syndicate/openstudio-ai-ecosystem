import Analytics from "@/app/(organization)/minime/components/analytics";
import AnalyticsSkeleton from "@/app/(organization)/minime/components/analytics/skeleton";
import { getBookmarkById } from "@/actions/bookmarks";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function BookmarkAnalytics({
  params,
}: {
  params: { id: string };
}) {
    const { id } = await params;
  const [bookmark] = await Promise.all([
    getBookmarkById(id)
  ]);

  if (!bookmark) {
    return notFound();
  }
  //TODO: focus on adding this later
//   if (!plan.isPro) {
//     return <Upgrade className="relative py-10" />;
//   }
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <Analytics
        basePath={`/api/bookmarks/${bookmark.id}`}
        index="clicks"
        title="Bookmark analytics"
      />
    </Suspense>
  );
}
