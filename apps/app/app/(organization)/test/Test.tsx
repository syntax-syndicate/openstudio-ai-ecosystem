'use client';

import { trpc } from '@/trpc/client';

export default function Test() {
  const videos = trpc.youtube.getVideos.useQuery();

  return (
    <div>
      <pre>{JSON.stringify(videos, null, 2)}</pre>
    </div>
  );
}
