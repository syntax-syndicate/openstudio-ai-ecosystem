'use client';

import useAppCommand from '@/hooks/use-app-command';
import type { User } from '@repo/backend/auth';
import { createClient } from '@repo/backend/auth/client';
import { getUserName } from '@repo/backend/auth/format';
import ThemeToggle from '@repo/design-system/components/theme-toggle';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/design-system/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Icons } from '@repo/design-system/components/ui/icons';
import { handleError } from '@repo/design-system/lib/handle-error';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  user: User | null;
  segment?: string;
}

export default function UserNav({ user, segment }: Props) {
  const setOpen = useAppCommand((state) => state.setOpen);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const client = await createClient();
      const response = await client.auth.signOut();

      if (response.error) {
        throw response.error;
      }

      router.push('/sign-in');
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="size-4.5 rounded-lg border-2 border-transparent bg-gray-2 outline-none data-[state=open]:border-gray-2"
        aria-label={getUserName(user!) as string}
      >
        <Avatar>
          <AvatarImage
            src={user?.user_metadata.image_url as string}
            alt={`${getUserName(user!) as string} Profile Picture`}
          />
          <AvatarFallback>
            {getUserName(user!).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]">
        <DropdownMenuItem asChild>
          <Link
            href={
              user?.user_metadata.domain
                ? `https://${user.user_metadata.domain}`
                : `https://${user?.user_metadata.username}.openstudio.tech`
            }
            target="_blank"
          >
            <Icons.arrowUpRight size={15} /> Your page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <Icons.command size={15} /> Command menu
        </DropdownMenuItem>
        <ThemeToggle />

        <DropdownMenuItem asChild>
          <Link
            href={'/minime/settings'}
            className={segment === 'settings' ? 'bg-gray-2 text-secondary' : ''}
          >
            <Icons.settings size={15} /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/minime'}>
            <Icons.logo size={15} /> Minime page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-danger" onClick={handleSignOut}>
          <Icons.logout size={15} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
