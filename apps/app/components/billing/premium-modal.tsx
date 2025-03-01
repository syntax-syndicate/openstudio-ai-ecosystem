import { Pricing } from '@/components/billing/pricing';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { useCallback, useState } from 'react';

export function usePremiumModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const PremiumModal = useCallback(() => {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl bg-white dark:bg-zinc-800">
          <Pricing />
        </DialogContent>
      </Dialog>
    );
  }, [isOpen]);

  return {
    openModal,
    PremiumModal,
  };
}
