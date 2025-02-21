'use client';

import { trpc } from '@/trpc/client';

export default function Test() {
  const [data] = trpc.hello.useSuspenseQuery({ name: 'Vineeth' });
  return <div>{data}</div>;
}
