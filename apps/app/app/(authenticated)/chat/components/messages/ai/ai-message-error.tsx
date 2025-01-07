import { type TSettingRoutes, useSettingsContext } from '@/context';
import { useModelList } from '@/hooks';
import type { TChatMessage } from '@/types';
import { Alert02Icon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import type { FC } from 'react';

type TAIMessageError = {
  stopReason?: string;
  errorMessage?: string;
  message: TChatMessage;
};

export const AIMessageError: FC<TAIMessageError> = ({
  stopReason,
  errorMessage,
  message,
}) => {
  const { open: openSettings } = useSettingsContext();

  const { getModelByKey } = useModelList();

  if (['finish', 'cancel', undefined].includes(stopReason)) {
    return <></>;
  }

  const model = getModelByKey(message?.runConfig?.assistant.baseModel);

  const renderErrorMessage = (stopReason?: string) => {
    if (stopReason === 'apikey') {
      return (
        <Type textColor="secondary">
          API Key is invalid or expired.
          <span
            className="ml-1 cursor-pointer underline"
            onClick={() =>
              openSettings(`models/${model?.provider}` as TSettingRoutes)
            }
          >
            Check your API Key
          </span>
        </Type>
      );
    }
    return <Type textColor="secondary">An unexpected error occurred.</Type>;
  };

  return (
    <Flex className="p-1 text-sm text-zinc-500" gap="sm" items="center">
      <Alert02Icon size={16} strokeWidth={1.5} />
      {renderErrorMessage(stopReason)}
    </Flex>
  );
};
