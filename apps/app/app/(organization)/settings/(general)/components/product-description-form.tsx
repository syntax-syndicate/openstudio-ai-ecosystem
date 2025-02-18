'use client';

import { updateOrganization } from '@/actions/organization/update';
import { Textarea } from '@repo/design-system/components/precomposed/textarea';
import { Button } from '@repo/design-system/components/ui/button';
import { handleError } from '@repo/design-system/lib/handle-error';
import { useState } from 'react';
import type { FormEventHandler } from 'react';

type ProductDescriptionFormProperties = {
  readonly defaultValue: string;
};

export const ProductDescriptionForm = ({
  defaultValue,
}: ProductDescriptionFormProperties) => {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(defaultValue);
  const disabled = loading || !description.trim();

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await updateOrganization({
        productDescription: description,
      });

      if (error) {
        throw new Error(error);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <Textarea
        value={description}
        onChangeText={setDescription}
        className="max-h-[20rem] min-h-[10rem] resize-y bg-background"
        placeholder="OpenStudio is an open-source AI ecosystem for building multi-assistant AI applications."
      />
      <Button type="submit" disabled={disabled}>
        Save
      </Button>
    </form>
  );
};
