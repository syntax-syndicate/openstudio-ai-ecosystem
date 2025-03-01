'use client';

import { trpc } from '@/trpc/client';

export default function Test() {
  const [data] = trpc.categories.getMany.useSuspenseQuery();
  return <div>{JSON.stringify(data)}</div>;
}
