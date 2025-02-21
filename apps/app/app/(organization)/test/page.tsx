import { trpc } from '@/trpc/server';
export default async function TestPage() {
  void trpc.hello.prefetch({ name: 'Vineeth' });
  return <div>Hello</div>;
}
