import { HugeiconsIcon } from '@hugeicons/react';
import { Alert, AlertDescription } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Alert02Icon } from '@repo/design-system/components/ui/icons';
import { useState } from 'react';
export type TGeneratedImage = {
  image: string;
};
export const GeneratedImage = ({ image }: TGeneratedImage) => {
  const [error, setError] = useState(false);
  return (
    <Flex direction="col" gap="md" className="mb-4">
      {!error && (
        <img
          src={image}
          onError={(e) => {
            setError(true);
          }}
          alt=""
          className="h-[400px] w-[400px] rounded-lg border"
        />
      )}
      <Alert variant="warning">
        <AlertDescription className="flex flex-row items-center gap-2">
          <HugeiconsIcon icon={Alert02Icon} size={20} />
          {error
            ? 'The image has expired. Please generate a new one.'
            : 'This image will expire in 1 hour. Please copy it before it expires.'}
        </AlertDescription>
      </Alert>
    </Flex>
  );
};
