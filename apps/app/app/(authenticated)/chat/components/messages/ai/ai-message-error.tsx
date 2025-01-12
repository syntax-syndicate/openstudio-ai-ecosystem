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
    if (stopReason === 'rateLimit') {
      return (
        <Type textColor="secondary">
          Too many requests. Try again tomorrow. or use your own api key
        </Type>
      );
    }
    if (stopReason === 'unauthorized') {
      return (
        <Type textColor="secondary">
          You are not authorized to access this resource.
        </Type>
      );
    }
    return <Type textColor="secondary">An unexpected error occurred.</Type>;
  };

  return (
    <Flex
      className="mb-4 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-500 dark:bg-white/5"
      gap="sm"
      items="center"
    >
      <Alert02Icon size={16} variant="solid" />
      {renderErrorMessage(stopReason)}
    </Flex>
  );
};
