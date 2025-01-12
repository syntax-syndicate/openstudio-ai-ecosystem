import { useAssistantUtils } from '@/hooks';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import type { TChatMessage } from '@/types';
import { Button } from '@repo/design-system/components/ui';
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

type ErrorConfig = {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const AIMessageError: FC<TAIMessageError> = ({
  stopReason,
  message,
}) => {
  const { push } = useRouter();

  const { getModelByKey } = useAssistantUtils();

  const { invokeModel } = useLLMRunner();
  if (!stopReason || ['finish', 'cancel', undefined].includes(stopReason)) {
    return null;
  }

  const model = getModelByKey(message?.runConfig?.assistant.baseModel);

  const errorConfigs: Record<string, ErrorConfig> = {
    apikey: {
      message: 'API Key is invalid or expired.',
      action: {
        label: 'Check API Key',
        onClick: () => push(`/settings/llms/${model?.provider}`),
      },
    },
    rateLimit: {
      message:
        'Too many requests. Please try again later or use your own API key.',
      action: {
        label: 'Open Settings',
        onClick: () => push('/settings/llms'),
      },
    },
    default: {
      message:
        'An unexpected error occurred. Please try again or contact support.',
      action: {
        label: 'Retry',
        onClick: () => {
          invokeModel(message.runConfig);
        },
      },
    },
  };

  const { message: errorMessage, action } =
    errorConfigs[stopReason] || errorConfigs.default;

  return (
    <Flex
      className="mb-4 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-500 dark:bg-white/5"
      gap="sm"
      items="center"
    >
      <Alert02Icon size={16} variant="solid" />
      <Type textColor="secondary">{errorMessage}</Type>
      {action && (
        <Button variant="ghost" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Flex>
  );
};
