import Link from 'next/link';

import { UserAvatar } from '@/components/user-avatar';
import { Button } from '@repo/design-system/components/ui/button';

import { UserInfo } from '@/modules/tube/users/ui/components/user-info';
import type { VideoGetOneOutput } from '../../types';

interface VideoOwnerProps {
  user: VideoGetOneOutput['user'];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar size="lg" imageUrl={''} name={'Vineeth'} />
          <div className="flex min-w-0 flex-col gap-1">
            <UserInfo size="lg" name={'UserName'} />
            <span className="line-clamp-1 text-muted-foreground text-sm">
              N subscribers
            </span>
          </div>
        </div>
      </Link>
      <Button
        variant="secondary"
        className="rounded-full"
        //   asChild
      >
        <Link href={`/tube/studio/${videoId}`}>Edit video</Link>
      </Button>
    </div>
  );
};
