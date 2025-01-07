import { useSettingsContext } from '@/context';
import {
  Alert,
  AlertDescription,
  Button,
} from '@repo/design-system/components/ui';
import type { FC } from 'react';

type TAIMessageError = {
  stopReason?: string;
  errorMessage?: string;
};

export const AIMessageError: FC<TAIMessageError> = ({
  stopReason,
  errorMessage,
}) => {
  const { open: openSettings } = useSettingsContext();

  if (stopReason === 'finish') {
    return <></>;
  }

  return (
    <Alert variant="destructive">
      <AlertDescription>
        {stopReason === 'cancel' && 'Cancelled generation'}

        {stopReason === 'apikey' && (
          <Button variant="link" size="link" onClick={() => openSettings()}>
            Check API Key
          </Button>
        )}
        {stopReason === 'error' && 'An unexpected error occurred.'}
      </AlertDescription>
    </Alert>
  );
};
