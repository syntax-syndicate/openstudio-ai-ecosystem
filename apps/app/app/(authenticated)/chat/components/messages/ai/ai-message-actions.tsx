import { RegenerateWithModelSelect } from '@/app/(authenticated)/chat/components/regenerate-model-select';
import { useChatContext, usePreferenceContext, useSessions } from '@/context';
import { useAssistantUtils, useClipboard } from '@/hooks';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import type { TChatMessage } from '@/types';
import { Button, Spinner } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  Copy01Icon,
  Delete01Icon,
  Tick01Icon,
} from '@repo/design-system/components/ui/icons';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { PopOverConfirmProvider } from '@repo/design-system/components/ui/use-confirmation-popover';
import type { FC } from 'react';

export type TAIMessageActions = {
  message: TChatMessage;
  canRegenerate: boolean;
};

export const AIMessageActions: FC<TAIMessageActions> = ({
  message,
  canRegenerate,
}) => {
  const { updatePreferences } = usePreferenceContext();
  const { refetch, store } = useChatContext();
  const currentMessage = store((state) => state.currentMessage);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const { getAssistantByKey } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();
  const { removeMessageByIdMutation } = useSessions();

  const { tools, runConfig, isLoading, rawAI } = message;
  const isToolRunning = !!tools?.filter((t) => !!t?.isLoading)?.length;
  const isGenerating = isLoading && !isToolRunning;
  const removeLastMessage = store((state) => state.removeLastMessage);

  const { showCopied, copy } = useClipboard();
  const handleCopyContent = () => {
    const doc = document.getElementById(`message-${message.id}`);
    if (doc) {
      copy(doc.innerText);
    }
  };

  const handleDeleteMessage = () => {
    removeMessageByIdMutation.mutate(
      {
        parentId: message.parentId,
        messageId: message.id,
      },
      {
        onSettled: () => {
          if (currentMessage?.id === message.id) {
            setCurrentMessage(undefined);
          } else {
            removeLastMessage();
          }
          refetch();
        },
      }
    );
  };

  const handleRegenerate = (assistant: string) => {
    const props = getAssistantByKey(assistant);
    if (!props?.assistant) {
      return;
    }

    updatePreferences({
      defaultAssistant: assistant,
    });

    if (currentMessage?.id !== message.id) {
      removeLastMessage();
    }

    setCurrentMessage(undefined);

    invokeModel({
      ...message.runConfig,
      messageId: message.id,
      assistant: props.assistant,
    });
  };

  return (
    <Flex
      justify="between"
      items="center"
      className="w-full opacity-100 transition-opacity"
    >
      {isGenerating && (
        <Flex gap="sm" items="center" className="py-1">
          <Spinner />
          <Type size="sm" textColor="tertiary">
            {!!rawAI?.length ? 'Typing ...' : 'Thinking ...'}
          </Type>
        </Flex>
      )}
      {!isLoading && (
        <Flex gap="xs" items="center" className="w-full">
          <Tooltip content="Copy">
            <Button
              variant="ghost"
              size="iconSm"
              rounded="lg"
              onClick={handleCopyContent}
            >
              {showCopied ? (
                <Tick01Icon size={16} variant="stroke" strokeWidth="2" />
              ) : (
                <Copy01Icon size={16} variant="stroke" strokeWidth="2" />
              )}
            </Button>
          </Tooltip>

          <Tooltip content="Delete">
            <PopOverConfirmProvider
              title="Are you sure you want to delete this message?"
              confimBtnVariant="destructive"
              onConfirm={handleDeleteMessage}
            >
              <Button variant="ghost" size="iconSm" rounded="lg">
                <Delete01Icon size={16} variant="stroke" strokeWidth="2" />
              </Button>
            </PopOverConfirmProvider>
          </Tooltip>
          {canRegenerate ? (
            <RegenerateWithModelSelect
              assistant={runConfig?.assistant}
              onRegenerate={handleRegenerate}
            />
          ) : (
            <Type size="xs" textColor="tertiary" className="px-2">
              {message.runConfig?.assistant?.name}
            </Type>
          )}
        </Flex>
      )}
    </Flex>
  );
};
