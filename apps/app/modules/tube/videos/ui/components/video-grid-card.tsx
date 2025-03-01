import Link from 'next/link';

import type { VideoGetManyOutput } from '../../types';
import { VideoInfo } from './video-info';
import { VideoInfoSkeleton } from './video-info';
import { VideoThumbnail } from './video-thumbnail';
import { VideoThumbnailSkeleton } from './video-thumbnail';

interface VideoGridCardProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

export const VideoGridCardSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
};

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link href={`/tube/home/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration ?? 0}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};
