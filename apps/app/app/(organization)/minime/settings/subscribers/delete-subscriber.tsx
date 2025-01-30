'use client';

import Button from '@repo/design-system/components/minime/button';
import { Icons } from '@repo/design-system/components/ui/icons';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { deleteSubscriber } from './actions';

export default function DeleteSubscriber({ id }: { id: string }) {
  const [state, formAction] = useFormState(deleteSubscriber, null);

  useEffect(() => {
    if (state?.error) {
      toast({
        title: state.error,
        variant: 'destructive',
      });
    }
  }, [state]);
  return (
    <form action={formAction} className="justify-right flex self-end">
      <input type="hidden" name="subId" value={id} />
      <FormButton />
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      variant="destructive"
      disabled={pending}
      className="border-none"
      aria-label="Subscriber Delete Button"
    >
      {pending ? (
        <Icons.spinner size={15} className="animate-spin text-danger" />
      ) : (
        <Icons.trash size={15} />
      )}
    </Button>
  );
}
