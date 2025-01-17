import { Mdx } from '@/app/(authenticated)/chat/components/mdx';
import { Dialog, DialogContent } from '@repo/design-system/components/ui';
import {
  Autoplay,
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@repo/design-system/components/ui/carousel';
import { Flex } from '@repo/design-system/components/ui/flex';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

export type Changelog = {
  id: string;
  images: string[];
  content: string;
  title: string;
};

export type ChangelogsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ChangeLogs = ({ open, setOpen }: ChangelogsProps) => {
  const { data, error } = useQuery<{ changelogs: Changelog[] }>({
    queryKey: ['changelogs'],
    queryFn: () => fetch('/api/changelogs').then((res) => res.json()),
  });
  const changelogs = data?.changelogs;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ariaTitle="Changelog"
        className="no-scrollbar max-h-[80vh] overflow-y-auto rounded-xl p-0"
      >
        {changelogs?.map((changelog) => (
          <div key={changelog.id}>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2000,
                }),
              ]}
              className="w-full bg-zinc-500/10"
            >
              <CarouselContent>
                {changelog.images.map((image) => (
                  <CarouselItem key={image}>
                    <Image
                      src={image}
                      alt={changelog.title}
                      width={0}
                      height={0}
                      className="h-auto w-full object-cover"
                      sizes="100vw"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <Flex direction="col" gap="md" className="px-6 py-4">
              <h3 className="font-medium text-xl">{changelog.title}</h3>
              <Mdx
                message={changelog.content}
                animate={true}
                size="sm"
                messageId={changelog.id}
              />
            </Flex>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};
