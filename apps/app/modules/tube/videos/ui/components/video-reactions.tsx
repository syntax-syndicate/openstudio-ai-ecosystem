import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';

import { trpc } from '@/trpc/client';
import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';
import { cn } from '@repo/design-system/lib/utils';
import { toast } from 'sonner';
import type { VideoGetOneOutput } from '../../types';

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput['viewerReaction'];
}

// TODO: properly implement video reactions
export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      // TODO: Invalidate "liked" playlist
    },
    onError: (error) => {
      toast.error('Something went wrong');
    },
  });

  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      // TODO: Invalidate "liked" playlist
    },
    onError: (error) => {
      toast.error('Something went wrong');
    },
  });

  return (
    <div className="flex flex-none items-center">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="gap-2 rounded-r-none rounded-l-full pr-4"
      >
        <ThumbsUpIcon
          className={cn('size-5', viewerReaction === 'like' && 'fill-black')}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-r-full rounded-l-none pl-3"
      >
        <ThumbsDownIcon
          className={cn('size-5', viewerReaction === 'dislike' && 'fill-black')}
        />
        {dislikes}
      </Button>
    </div>
  );
};
