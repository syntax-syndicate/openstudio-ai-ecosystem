import NavButton from '@/app/(organization)/minime/components/layout/nav-button';
import { getUserById } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { subscribers } from '@repo/backend/schema';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unsubscribe } from './action';

interface Props {
  searchParams: {
    subId: string;
  };
}

export const metadata: Metadata = {
  title: 'Unsubscribe',
};

export default async function Unsubscribe({ searchParams }: Props) {
  const { subId } = await searchParams;
  if (!subId) {
    return notFound();
  }

  const subscriber = await database
    .select()
    .from(subscribers)
    .where(eq(subscribers.id, searchParams.subId))
    .limit(1)
    .then((rows) => rows[0]);

  const user = await getUserById(subscriber.userId);

  if (!subscriber) {
    return notFound();
  }

  const data: { error?: string; success?: string } = await unsubscribe(
    searchParams.subId,
    subscriber.userId
  );

  return (
    <div className="mx-auto flex min-h-screen w-[450px] items-center justify-center px-2 max-[450px]:w-full">
      <div className="flex w-full flex-col items-center justify-center gap-3 rounded-md border border-gray-2 bg-gray-3 p-5">
        {data.success ? (
          <p className="text-center text-gray-4">
            You&apos;ve successfully been unsubscribed from{' '}
            <b>
              {user?.user_metadata?.username}
              &apos;s newsletter.
            </b>
          </p>
        ) : (
          <b className="text-danger text-sm">{data.error}</b>
        )}

        <NavButton
          icon="arrowUpRight"
          buttonClassname="w-max px-2"
          href={`https://${user?.user_metadata?.domain || `${user?.user_metadata?.username}.` + process.env.NEXT_PUBLIC_USER_DOMAIN}`}
        >
          Resubscribe
        </NavButton>
      </div>
    </div>
  );
}
