'use client';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { SearchIcon, XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

export const SearchInput = () => {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <SearchInputSuspense />
    </Suspense>
  );
};

const SearchInputSuspense = () => {
  const router = useRouter();
  const [value, setValue] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = new URL('/tube/home', `${process.env.NEXT_PUBLIC_APP_URL}`);
    const newQuery = value.trim();

    url.searchParams.set('query', encodeURIComponent(newQuery));

    if (newQuery === '') {
      url.searchParams.delete('query');
    }

    setValue(newQuery);
    router.push(url.toString());
  };

  return (
    <form
      className="flex w-full max-w-[600px] rounded-r-full border-r-2"
      onSubmit={handleSearch}
    >
      <div className="relative w-full">
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          className="w-full rounded-full rounded-r-none border py-2 pr-12 pl-4 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setValue('')}
            className="-translate-y-1/2 absolute top-1/2 right-2 rounded-full"
          >
            <XIcon className="text-gray-500" />
          </Button>
        )}
      </div>
      <button
        type="submit"
        disabled={!value.trim()}
        className="flex items-center justify-center rounded-full rounded-l-none border border-l-0 px-3 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-800"
      >
        <SearchIcon className="size-5 text-gray-500" />
      </button>
    </form>
  );
};
