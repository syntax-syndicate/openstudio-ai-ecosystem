'use client';

import { Icons } from '@repo/design-system/components/ui/icons';
import { getDomainFromURL } from '@repo/design-system/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

export default function Favicon({
  url,
  alt,
  size = 20,
}: {
  url: string;
  alt?: string;
  size?: number;
}) {
  const [err, setErr] = useState<boolean>(false);

  if (err) {
    return (
      <div>
        <Icons.globe
          width={size}
          height={size}
          className="relative z-10 flex text-gray-1"
        />
      </div>
    );
  }
  return (
    <Image
      src={
        url.includes('flagcdn')
          ? url
          : `https://icons.duckduckgo.com/ip3/${getDomainFromURL(url)}.ico`
      }
      alt={alt || 'icon'}
      className="z-10"
      width={size}
      height={size}
      onError={() => setErr(true)}
    />
  );
}
