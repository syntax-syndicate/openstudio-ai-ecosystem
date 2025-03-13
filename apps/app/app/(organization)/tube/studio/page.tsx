import { DEFAULT_LIMIT } from '@/config/constants';
import { StudioView } from '@/modules/tube/studio/ui/views/studio-view';
import { HydrateClient } from '@/trpc/server';
import { trpc } from '@/trpc/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Studio',
  description: 'Studio',
};

const Page = async () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
