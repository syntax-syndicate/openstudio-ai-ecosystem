import { useAssistantUtils } from '@/hooks';
import type { TChatMessage } from '@/types';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Alert02Icon } from '@repo/design-system/components/ui/icons';
import { Type } from '@repo/design-system/components/ui/text';
import { useRouter } from 'next/navigation';
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
  const { push } = useRouter();

  const { getModelByKey } = useAssistantUtils();

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
            onClick={() => push(`/chat/settings/llms/${model?.provider}`)}
          >
            Check your API Key
          </span>
        </Type>
      );
    }
    return <Type textColor="secondary">An unexpected error occurred.</Type>;
  };

  return (
    <Flex
      className="mb-4 rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-500"
      gap="sm"
      items="center"
    >
      <Alert02Icon size={16} strokeWidth={1.5} />
      {renderErrorMessage(stopReason)}
    </Flex>
  );
};
