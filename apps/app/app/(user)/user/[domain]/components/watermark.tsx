import type { User } from '@repo/backend/auth';
import { Badge } from '@repo/design-system/components/ui/badge';
import Link from 'next/link';

export default async function Watermark({ user }: { user: Pick<User, 'id'> }) {
  // const plan = await currentUser();
  // TODO: add pro plan
  //   if (plan?.user_metadata.isPro) {
  //     return null;
  //   }
  return (
    <Link
      href="https://openstudio.tech"
      target="_blank"
      aria-label="Powered by Open Studio"
    >
      <Badge className="fixed right-4.4 bottom-4.4 border border-gray-2 font-normal text-gray-4 text-xs ">
        Powered by Open Studio
      </Badge>
    </Link>
  );
}
