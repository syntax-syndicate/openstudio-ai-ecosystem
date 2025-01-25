'use client';
import ExportButton from '@/components/forms/export-button';
import type { Collection } from '@/helper/utils';
import Button from '@repo/design-system/components/minime/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddEditBookmarkModal from './add-edit-bookmark-modal';
import AddEditCollectionModal from './collections/add-edit-collection-modal';
export type Action = 'newBookmark' | 'newCollection' | 'manageCollections';

export default function AddBookmarkOrCollection({
  collections,
}: {
  collections: Collection[];
}) {
  const action = (useSearchParams().get('action') as Action) || '';
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (action === 'newBookmark' || action === 'newCollection') {
      setIsOpen(true);
    }
  }, [action]);

  return (
    <Popover modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="data-[state=open]:bg-gray-2 data-[state=open]:text-secondary"
          aria-label="Add bookmark or collection"
        >
          <Icons.more size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col bg-gray-3 p-1">
        <AddEditBookmarkModal
          open={action === 'newBookmark'}
          collections={collections}
        />
        <AddEditCollectionModal open={action === 'newCollection'} />
        <ExportButton
          text="Export bookmarks"
          buttonVariant="ghost"
          endpoint="bookmarks/export"
        />
      </PopoverContent>
    </Popover>
  );
}
