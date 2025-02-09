import { Pricing } from '@/components/billing/pricing';
import { useRootContext } from '@/context/root';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';

export const PricingModal = () => {
  const { openPricingModal, setOpenPricingModal } = useRootContext();

  return (
    <Dialog open={openPricingModal} onOpenChange={setOpenPricingModal}>
      <DialogContent
        ariaTitle="Pricing"
        className="no-scrollbar !max-w-7xl z-[9999] max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Pricing</DialogTitle>
        </DialogHeader>
        <Pricing />
      </DialogContent>
    </Dialog>
  );
};
