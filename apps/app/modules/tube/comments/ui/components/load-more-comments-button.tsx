'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { BarChart2Icon } from 'lucide-react';

export function LoadMoreCommentsButton() {
  return (
    <div>
      <Button color="red" variant={'outline'} onClick={() => {}}>
        <BarChart2Icon className="mr-2 h-4 w-4" />
        Load more comments
      </Button>
    </div>
  );
}
