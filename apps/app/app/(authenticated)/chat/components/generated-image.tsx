import { Alert02Icon } from '@hugeicons/react';
import { Alert, AlertDescription } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { useState } from 'react';
export type TGeneratedImage = {
  image: string;
};
export const GeneratedImage = ({ image }: TGeneratedImage) => {
  const [error, setError] = useState(false);
  return (
    <Flex direction="col" gap="sm">
      {!error && (
        <img
          src={image}
          onError={(e) => {
            setError(true);
          }}
          alt=""
          className="h-[400px] w-[400px] rounded-2xl border"
        />
      )}
      <Alert variant="warning">
        <AlertDescription className="flex flex-row items-center gap-2">
          <Alert02Icon size={20} />
          {error
            ? 'The image has expired. Please generate a new one.'
            : 'This image will expire in 1 hour. Please copy it before it expires.'}
        </AlertDescription>
      </Alert>
    </Flex>
  );
};
