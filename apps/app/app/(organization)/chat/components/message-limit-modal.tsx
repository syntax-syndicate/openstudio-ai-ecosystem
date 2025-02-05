import { useRootContext } from '@/context/root';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@repo/design-system/components/ui/dialog';

export const MessageLimitModal = () => {
  const { openMessageLimitModal, setOpenMessageLimitModal } = useRootContext();

  return (
    <Dialog open={openMessageLimitModal} onOpenChange={setOpenMessageLimitModal}>
      <DialogContent
        ariaTitle="Message Limit"
        className="no-scrollbar z-[9999] max-h-[80vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Message Limit</DialogTitle>
        </DialogHeader>
        <DialogDescription>
            You have exceeded the message limit for this month. Usage based pricing is WIP for more messages.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
