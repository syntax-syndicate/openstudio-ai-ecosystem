import { Badge } from "@repo/design-system/components/ui/badge";
import type { User } from "@repo/backend/auth";
import Link from "next/link";
import { currentUser } from "@repo/backend/auth/utils";

export default async function Watermark({ user }: { user: Pick<User, "id"> }) {
  const plan = await currentUser();
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
      <Badge className="text-xs fixed right-4.4 bottom-4.4 text-gray-4 font-normal border border-gray-2 ">
        Powered by Open Studio
      </Badge>
    </Link>
  );
}
