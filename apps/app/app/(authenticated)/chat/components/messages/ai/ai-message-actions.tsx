import { RegenerateWithModelSelect } from '@/app/(authenticated)/chat/components/regenerate-model-select';
import { useChatContext, useSessions } from '@/context';
import { useClipboard, useModelList } from '@/hooks';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import type { TChatMessage } from '@/types';
import { Copy01Icon, Delete01Icon, Tick01Icon } from '@hugeicons/react';
import { Button, Spinner } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { ConfirmPopover } from '@repo/design-system/components/ui/popover-confirm';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { type FC, useState } from 'react';

export type TAIMessageActions = {
  message: TChatMessage;
  canRegenerate: boolean;
};

export const AIMessageActions: FC<TAIMessageActions> = ({
  message,
  canRegenerate,
}) => {
  const { refetch } = useChatContext();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const { getAssistantByKey } = useModelList();
  const { invokeModel } = useLLMRunner();
  const { removeMessageByIdMutation } = useSessions();

  const { tools, runConfig, isLoading, rawAI } = message;
  const isToolRunning = !!tools?.filter((t) => !!t?.toolLoading)?.length;
  const isGenerating = isLoading && !isToolRunning;

  const { showCopied, copy } = useClipboard();
  const handleCopyContent = () => {
    rawAI && copy(rawAI);
  };

  const handleRegenerate = (assistant: string) => {
    const props = getAssistantByKey(assistant);
    if (!props?.assistant) {
      return;
    }
    invokeModel({
      ...message.runConfig,
      assistant: props.assistant,
      messageId: message.id,
    });
  };

  return (
    <Flex
      justify="between"
      items="center"
      className="w-full pt-1 opacity-100 transition-opacity"
    >
      {isGenerating && (
        <Flex gap="sm">
          <Spinner />
          <Type size="sm" textColor="tertiary">
            {!!rawAI?.length ? 'Typing ...' : 'Thinking ...'}
          </Type>
        </Flex>
      )}
      {!isLoading && (
        <div className="flex flex-row gap-1">
          <Tooltip content="Copy">
            <Button
              variant="ghost"
              size="iconSm"
              rounded="lg"
              onClick={handleCopyContent}
            >
              {showCopied ? (
                <Tick01Icon size={18} variant="stroke" strokeWidth="2" />
              ) : (
                <Copy01Icon size={18} variant="stroke" strokeWidth="2" />
              )}
            </Button>
          </Tooltip>

          <Tooltip content="Delete">
            <ConfirmPopover
              title="Are you sure you want to delete this message?"
              onConfirm={() => {
                removeMessageByIdMutation.mutate(
                  {
                    parentId: message.parentId,
                    messageId: message.id,
                  },
                  {
                    onSuccess: refetch,
                  }
                );
              }}
              open={openDeleteConfirm}
              onOpenChange={setOpenDeleteConfirm}
            >
              <Button variant="ghost" size="iconSm" rounded="lg">
                <Delete01Icon size={18} variant="stroke" strokeWidth="2" />
              </Button>
            </ConfirmPopover>
          </Tooltip>
          {canRegenerate && (
            <RegenerateWithModelSelect
              assistant={runConfig?.assistant}
              onRegenerate={handleRegenerate}
            />
          )}
        </div>
      )}
    </Flex>
  );
};
