import { CommentView } from '@/modules/tube/comments/ui/views/comment-view';
import { HydrateClient, trpc } from '@/trpc/server';
import { currentOrganizationId } from '@repo/backend/auth/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Open Studio Tube - Youtube Comments',
  description: 'Open Studio Tube - Youtube Comments',
};

export default async function CommentsPage() {
  const organizationId = await currentOrganizationId();
  if (!organizationId) {
    return notFound();
  }
  void trpc.youtube.getCommentsWithReplies.prefetchInfinite({
    organization_id: organizationId,
    limit: 100,
  });
  return (
    <HydrateClient>
      <CommentView organizationId={organizationId} />
    </HydrateClient>
  );
}
