import { FeedbackModal } from '@/app/(authenticated)/chat/components/feedback/feedback-modal';
import { useState } from 'react';

export const useFeedback = () => {
  const [open, setOpen] = useState(false);
  const renderModal = () => {
    return <FeedbackModal open={open} onOpenChange={setOpen} />;
  };
  return { open, setOpen, renderModal };
};
