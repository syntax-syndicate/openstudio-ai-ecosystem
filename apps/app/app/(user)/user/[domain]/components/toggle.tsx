'use client';

import useNavigation from '@/hooks/use-navigation';
import Button from '@repo/design-system/components/minime/button';
import { Icons } from '@repo/design-system/components/ui/icons';

export default function CommandMenuToggle() {
  const setOpen = useNavigation((state) => state.setOpen);
  return (
    <Button
      size="icon"
      onClick={() => setOpen(true)}
      aria-label="Navigation"
      variant="secondary"
    >
      <Icons.command size={15} />
    </Button>
  );
}
