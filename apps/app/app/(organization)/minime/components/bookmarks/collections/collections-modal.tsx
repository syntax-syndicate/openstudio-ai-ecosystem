'use client';

import type { Action } from '@/app/(organization)/minime/components/bookmarks/add-bookmark-or-collection';
import type { Bookmark, Collection } from '@/helper/utils';
import Button from '@repo/design-system/components/minime/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';
import { Icons } from '@repo/design-system/components/ui/icons';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CollectionOperations from './collection-operations';

type CollectionWithBookmarks = Collection & {
  bookmarks: Bookmark[] | null;
};

export default function CollectionsModal({
  collections,
}: {
  collections: CollectionWithBookmarks[];
}) {
  const action = (useSearchParams().get('action') as Action) || '';
  const [showCollectionsModal, setShowCollectionsModal] = useState<boolean>(
    !!action
  );

  useEffect(() => {
    if (action === 'manageCollections') {
      setShowCollectionsModal(true);
    } else {
      setShowCollectionsModal(false);
    }
  }, [action]);

  return (
    <Dialog open={showCollectionsModal} onOpenChange={setShowCollectionsModal}>
      <Button
        size="icon"
        variant="secondary"
        aria-label="Manage collections"
        onClick={() => setShowCollectionsModal(true)}
      >
        <Icons.collection size={18} />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collections</DialogTitle>
        </DialogHeader>

        {collections.length ? (
          <div className="no-scrollbar grid grid-cols-2 gap-2 overflow-auto max-sm:grid-cols-1">
            {collections.map((collection) => (
              <CollectionItem collection={collection} key={collection.id} />
            ))}
          </div>
        ) : null}

        {!collections.length && (
          <div className="text-center text-gray-1">
            You don&apos;t have any collection
          </div>
        )}
        <DialogFooter>
          <Button
            title="Cancel"
            size="sm"
            variant="ghost"
            onClick={() => setShowCollectionsModal(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CollectionItem({
  collection,
}: {
  collection: CollectionWithBookmarks;
}) {
  return (
    <div
      key={collection.id}
      className="group flex items-center justify-between rounded-md border border-gray-2 p-2 text-gray-4 text-sm transition-colors"
    >
      <div>
        <p className="">{collection.name}</p>
        <b className="text-xs">{collection.bookmarks?.length} bookmarks</b>
      </div>
      <CollectionOperations collection={collection} />
    </div>
  );
}
