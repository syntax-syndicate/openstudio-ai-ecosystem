import ExportButton from "@/components/forms/export-button";
import { Icons } from "@repo/design-system/components/ui/icons";
import { Badge } from "@repo/design-system/components/minime/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import { getSubscribersByUserId } from "@/actions/subscribers";
import { currentUser } from "@repo/backend/auth/utils";
// import { getUserSubscription } from "@/lib/subscription";
import { formatDate, Subscriber } from "@/helper/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeleteSubscriber from "./delete-subscriber";
import Newsletter from "./newsletter";

export const metadata: Metadata = {
  title: "Subscribers",
};

export default async function Subscribers() {
  const user = await currentUser();
  if (!user) {
    return notFound();
  }
  const [subscribers] = await Promise.all([
    getSubscribersByUserId(user.id),
  ]);

//   if (!plan.isPro) {
//     return <Upgrade className="relative py-10" />;
//   }
  return (
    <div className="flex flex-col gap-2 ">
      {user.user_metadata?.newsletter ? (
        <>
          <div className="w-full flex justify-between items-center mb-3">
            <div className="flex gap-2">
              <Badge>{subscribers.length} Subscribers</Badge>
              <ExportButton
                text="Export subscribers"
                icon="download"
                endpoint="subscribers/export"
              />
            </div>
            <Newsletter checked={user.user_metadata?.newsletter} />
          </div>
          <SubscribersTable subscribers={subscribers} />
        </>
      ) : (
        <div className=" flex flex-col gap-2 items-center justify-center border p-3 border-gray-2 text-center text-gray-1 rounded-md text-sm">
          Your newsletter function is not active, you can activate it whenever
          you want.
          <Newsletter checked={user.user_metadata?.newsletter} />
        </div>
      )}
    </div>
  );
}

function SubscribersTable({ subscribers }: { subscribers?: Subscriber[] }) {
  return (
    <Table>
      <TableCaption>subscribers</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Subscribed</TableHead>
          <TableHead className="flex justify-end items-center">
            <div className="size-4.5 flex justify-center items-center">
              <Icons.trash size={15} className="text-danger" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {subscribers?.map((subscriber) => (
          <TableRow key={subscriber.id}>
            <TableCell className="font-medium">{subscriber.name}</TableCell>
            <TableCell>{subscriber.email}</TableCell>
            <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
            <TableCell className="flex justify-end">
              <DeleteSubscriber id={subscriber.id} />
            </TableCell>
          </TableRow>
        ))}
        {!subscribers?.length && (
          <TableRow>
            <TableCell className="font-medium text-gray-4">
              No subscribers found
            </TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
