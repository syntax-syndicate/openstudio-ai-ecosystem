import { useRef } from 'react';

import { CustomAssistantAvatar } from '@/app/(organization)/chat/components/custom-assistant-avatar';
import { Mdx } from '@/app/(organization)/chat/components/mdx';
import { AIMessageActions } from '@/app/(organization)/chat/components/messages/ai/ai-message-actions';
import { AIMessageError } from '@/app/(organization)/chat/components/messages/ai/ai-message-error';
import { AIRelatedQuestions } from '@/app/(organization)/chat/components/messages/ai/ai-related-questions';
import { AISelectionProvider } from '@/app/(organization)/chat/components/messages/ai/ai-selection-provider';
import { AIToolMessage } from '@/app/(organization)/chat/components/messages/ai/ai-tool-message';
import { ModelIcon } from '@/app/(organization)/chat/components/model-icon';
import { useChatContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TChatMessage } from '@/types';
import { Flex } from '@repo/design-system/components/ui/flex';
export type TAIMessage = {
  message: TChatMessage;
  isLast: boolean;
};

export const AIMessage = ({ message, isLast }: TAIMessage) => {
  const { id, rawAI, isLoading, stopReason, tools, runConfig, stop } = message;

  const { store } = useChatContext();
  const session = store((state) => state.session);
  const editor = store((state) => state.editor);
  const setContextValue = store((state) => state.setContext);
  const messageRef = useRef<HTMLDivElement>(null);
  const { getAssistantIcon } = useAssistantUtils();

  const handleSelection = (value: string) => {
    setContextValue(value);
    editor?.commands.clearContent();
    editor?.commands.focus('end');
  };

  return (
    <div className="mt-2 flex w-full flex-row items-start justify-start gap-3">
      <Flex className="flex-shrink-0">
        {session?.customAssistant?.iconURL ? (
          <CustomAssistantAvatar
            url={session?.customAssistant?.iconURL}
            alt={session?.customAssistant?.name}
            size="sm"
          />
        ) : (
          <ModelIcon type="assistants" size="sm" />
        )}
      </Flex>
      <Flex
        ref={messageRef}
        direction="col"
        gap="lg"
        items="start"
        className="min-w-0 flex-grow pb-8"
      >
        {!!tools?.length && (
          <Flex className="w-full gap-1 pb-2" direction="col">
            {tools?.map((tool) => (
              <AIToolMessage tool={tool} key={tool.toolName} />
            ))}
          </Flex>
        )}

        <AISelectionProvider onSelect={handleSelection}>
          <Mdx
            message={rawAI ?? undefined}
            animate={!!isLoading}
            messageId={id}
          />
        </AISelectionProvider>
        {stop && (
          <AIMessageError
            stopReason={stopReason ?? undefined}
            message={message}
          />
        )}
        <AIMessageActions message={message} canRegenerate={message && isLast} />
        <AIRelatedQuestions message={message} show={message && isLast} />
      </Flex>
    </div>
  );
};
