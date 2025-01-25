import {
  type Bar,
  BarListItem,
} from '@/app/(organization)/minime/components/analytics/bar-list';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Icons } from '@repo/design-system/components/ui/icons';
import { capitalize } from '@repo/design-system/lib/utils';

export default function ViewAllBarlist({
  data,
  title,
}: {
  data: Bar[];
  title: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="absolute bottom-0 z-30 flex w-full items-center justify-center rounded-b-md bg-gradient-to-t from-gray-3 to-transparent py-1 outline-0">
          <Button
            className="rounded-full"
            size="sm"
            aria-label={`View all ${title}`}
          >
            View all
            <Icons.maximize size={15} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{capitalize(title)}</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar flex max-h-[600px] flex-col gap-2 overflow-y-auto">
          {data?.map((item) => (
            <BarListItem
              className="hover:bg-gray-2"
              item={item}
              key={item.name}
              total={data[0].value}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
