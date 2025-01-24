import { capitalize } from "@repo/design-system/lib/utils";
import { Icons } from "@repo/design-system/components/ui/icons";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import { type Bar, BarListItem } from "@/app/(organization)/minime/components/analytics/bar-list";

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
        <div className="absolute items-center bg-gradient-to-t outline-0 from-gray-3 to-transparent rounded-b-md bottom-0 z-30 flex py-1 w-full justify-center">
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
        <div className="flex flex-col gap-2  max-h-[600px] overflow-y-auto no-scrollbar">
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
