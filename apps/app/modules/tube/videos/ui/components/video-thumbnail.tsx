import Image from 'next/image';

import { formatDuration } from '@/lib/utils';

import { THUMBNAIL_FALLBACK } from '@/lib/constants';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';

interface VideoThumbnailProps {
  title: string;
  duration: number;
  imageUrl?: string | null;
  previewUrl?: string | null;
}

export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl">
      <Skeleton className="size-full" />
    </div>
  );
};

export const VideoThumbnail = ({
  title,
  imageUrl,
  previewUrl,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="group relative">
      {/* Thumbnail wrapper */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      {/* Video duration box */}
      <div className="absolute right-2 bottom-2 rounded bg-black/80 px-1 py-0.5 font-medium text-white text-xs">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
