import { Globe02Icon } from '@hugeicons/react';
import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';
import { type FC, useState } from 'react';

export type TSeachFavicon = {
  link: string;
  className?: string;
};

export const SearchFavicon: FC<TSeachFavicon> = ({ link, className }) => {
  const [error, setError] = useState<boolean>(false);
  if (error) {
    return (
      <Globe02Icon
        size={14}
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
      className={cn(className, 'h-4 w-4 rounded-sm object-cover')}
      sizes="70vw"
    />
  );
};
