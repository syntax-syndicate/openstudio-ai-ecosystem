"use client";

import { Icons } from "@repo/design-system/components/ui/icons";
import Button from "@repo/design-system/components/minime/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CollectionOperations from "./collection-operations";
import { Collection, Bookmark } from "@/helper/utils";
import { Action } from "@/app/(organization)/minime/components/bookmarks/add-bookmark-or-collection";

type CollectionWithBookmarks = Collection & {
  bookmarks: Bookmark[] | null;
};

export default function CollectionsModal({
  collections,
}: {
  collections: CollectionWithBookmarks[];
}) {
  const action = (useSearchParams().get("action") as Action) || "";
  const [showCollectionsModal, setShowCollectionsModal] =
    useState<boolean>(!!action);

  useEffect(() => {
    if (action === "manageCollections") {
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
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-2  overflow-auto no-scrollbar">
            {collections.map((collection) => (
              <CollectionItem collection={collection} key={collection.id} />
            ))}
          </div>
        ) : null}

        {!collections.length && (
          <div className="text-gray-1 text-center">
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
      className="text-sm  p-2 flex justify-between group  transition-colors items-center border border-gray-2  text-gray-4 rounded-md"
    >
      <div>
        <p className="text-secondary">{collection.name}</p>
        <b className="text-xs">{collection.bookmarks?.length} bookmarks</b>
      </div>
      <CollectionOperations collection={collection} />
    </div>
  );
}
