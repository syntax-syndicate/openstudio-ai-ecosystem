'use client';

import type { Collection } from '@/helper/utils';
import Button from '@repo/design-system/components/minime/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import { Icons } from '@repo/design-system/components/ui/icons';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddEditCollectionModal from './add-edit-collection-modal';

async function deleteCollection(collectionId: string) {
  const response = await fetch(`/api/bookmarks/collections/${collectionId}`, {
    method: 'DELETE',
  });

  if (!response?.ok) {
    toast({
      title: 'Something went wrong.',
      description: 'Your collection was not deleted. Please try again.',
    });
  }

  return true;
}

export default function CollectionOperations({
  collection,
}: {
  collection: Collection;
}) {
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Delete or edit collection"
          className="size-4.4 data-[state=open]:bg-gray-2"
        >
          <Icons.more size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border border-gray-2">
        <AddEditCollectionModal collection={collection} edit />
        <Button
          size="sm"
          variant="destructive"
          className="justify-start gap-2 border-0"
          disabled={isDeleteLoading}
          onClick={async (e) => {
            e.preventDefault();
            setIsDeleteLoading(true);
            const deleted = await deleteCollection(collection.id);
            setIsDeleteLoading(false);
            router.refresh();
            if (deleted) {
              toast({
                title: 'Collection deleted',
              });
            }
          }}
        >
          {isDeleteLoading ? (
            <>
              <Icons.spinner className="animate-spin" size={15} /> Deleting
            </>
          ) : (
            <>
              <Icons.trash size={15} /> Delete
            </>
          )}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
