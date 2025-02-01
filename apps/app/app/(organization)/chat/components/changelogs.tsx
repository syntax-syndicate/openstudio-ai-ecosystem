import { Dialog, DialogContent } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';

export type Changelog = {
  id: string;
  images: string[];
  content: string;
  title: string;
  createdAt: string;
};

export type ChangelogsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ChangeLogs = ({ open, setOpen }: ChangelogsProps) => {
  const { data, error } = useQuery<{ changelogs: Changelog[] }>({
    queryKey: ['changelogs'],
    queryFn: () => fetch('/api/changelogs').then((res) => res.json()),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
  const changelogs = data?.changelogs || [];
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ariaTitle="Changelog"
        className="no-scrollbar !max-w-[500px] max-h-[80vh] gap-0 overflow-y-auto rounded-xl p-0"
      >
        <Flex className="w-full border-b py-3" justify="center">
          <Type size="base" weight="bold">
            <Flame size={20} /> What&apos;s new
          </Type>
        </Flex>
        <Flex>
          <Type>Work In Progress 🚧</Type>
        </Flex>
        {/* {changelogs?.map((changelog) => (
          <Flex
            key={changelog.id}
            className="px-6 py-4"
            direction="col"
            gap="md"
          >
            <Flex direction="col" gap="none">
              <Type size="lg" weight="medium">
                {changelog.title}
              </Type>
              <Type size="sm" textColor="secondary">
                {getRelativeDate(changelog.createdAt)}
              </Type>
            </Flex>
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
              className="w-full overflow-hidden rounded-xl bg-zinc-500/10"
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
            <Flex direction="col" gap="md">
              <Mdx
                message={changelog.content}
                animate={true}
                size="sm"
                messageId={changelog.id}
              />
            </Flex>
          </Flex>
        ))} */}
      </DialogContent>
    </Dialog>
  );
};
