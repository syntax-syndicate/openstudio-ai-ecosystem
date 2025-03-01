'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@repo/design-system/components/ui/badge';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/design-system/components/ui/carousel-tube';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { cn } from '@repo/design-system/lib/utils';

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}

export const FilterCarousel = ({
  value,
  onSelect,
  data,
  isLoading,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="relative w-full">
      {/* Left fade */}
      <div
        className={cn(
          'pointer-events-none absolute top-0 bottom-0 left-12 z-10 w-12 bg-gradient-to-r from-white to-transparent',
          current === 1 && 'hidden'
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          dragFree: true,
          containScroll: 'trimSnaps',
        }}
        className="w-full px-12" // TODO: Make this dynamic, As of now it's hardcoded to 4xl since it was causing the issues.
      >
        <CarouselContent className="-ml-3">
          {!isLoading && (
            <CarouselItem
              onClick={() => onSelect(null)}
              className="basis-auto pl-3"
            >
              <Badge
                variant={value ? 'secondary' : 'default'}
                className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-sm"
              >
                All
              </Badge>
            </CarouselItem>
          )}
          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="basis-auto pl-3">
                <Skeleton className="h-full w-[100px] rounded-lg px-3 py-1 font-semibold text-sm">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading &&
            data.map((item) => (
              <CarouselItem
                key={item.value}
                className="basis-auto pl-3"
                onClick={() => onSelect(item.value)}
              >
                <Badge
                  variant={value === item.value ? 'default' : 'secondary'}
                  className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-sm"
                >
                  {item.label}
                </Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 z-20" />
        <CarouselNext className="right-0 z-20" />
      </Carousel>

      {/* Right fade */}
      <div
        className={cn(
          'pointer-events-none absolute top-0 right-12 bottom-0 z-10 w-12 bg-gradient-to-l from-white to-transparent',
          current === count && 'hidden'
        )}
      />
    </div>
  );
};
