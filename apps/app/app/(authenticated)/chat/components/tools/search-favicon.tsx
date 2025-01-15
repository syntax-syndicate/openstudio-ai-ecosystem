import { Globe02Icon } from '@hugeicons/react';
import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';
import { type FC, useState } from 'react';

export type TSeachFavicon = {
  link: string;
  className?: string;
  size?: 'sm' | 'md';
};

export const SearchFavicon: FC<TSeachFavicon> = ({
  link,
  className,
  size = 'sm',
}) => {
  const [error, setError] = useState<boolean>(false);
  if (error) {
    return (
      <Globe02Icon
        size={size === 'sm' ? 16 : 18}
        strokeWidth={1.5}
        className={cn(className, 'text-gray-500')}
      />
    );
  }
  return (
    <Image
      src={`https://www.google.com/s2/favicons?domain=${link}&sz=${256}`}
      alt="favicon"
      onError={(e) => {
        setError(true);
      }}
      width={0}
      height={0}
      className={cn(
        'rounded-sm object-cover',
        className,
        size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
      )}
      sizes="70vw"
    />
  );
};
