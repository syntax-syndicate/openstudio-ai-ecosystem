import { trpc } from '@/trpc/server';
import Test from './Test';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  void trpc.youtube.getVideos.prefetch();
  return (
    <div>
      <Test />
    </div>
  );
}
