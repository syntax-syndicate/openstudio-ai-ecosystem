import { useRef } from 'react';

import { Mdx } from '@/app/(authenticated)/chat/components/mdx';
import { AIMessageActions } from '@/app/(authenticated)/chat/components/messages/ai/ai-message-actions';
import { AIMessageError } from '@/app/(authenticated)/chat/components/messages/ai/ai-message-error';
import { AIRelatedQuestions } from '@/app/(authenticated)/chat/components/messages/ai/ai-related-questions';
import { AISelectionProvider } from '@/app/(authenticated)/chat/components/messages/ai/ai-selection-provider';
import { AIToolMessage } from '@/app/(authenticated)/chat/components/messages/ai/ai-tool-message';
import { useChatContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TChatMessage } from '@/types';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';

export type TAIMessage = {
  message: TChatMessage;
  isLast: boolean;
};

export const AIMessage = ({ message, isLast }: TAIMessage) => {
  const { id, rawAI, isLoading, stopReason, tools, runConfig, stop } = message;

  const { store } = useChatContext();
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
    <div className="mt-6 flex w-full flex-col items-start md:flex-row">
      <Tooltip content={runConfig.assistant.name}>
        <div className="p-2 md:px-3 md:py-2">
          {getAssistantIcon(runConfig.assistant.key, 'sm')}
        </div>
      </Tooltip>
      <Flex
        ref={messageRef}
        direction="col"
        gap="none"
        items="start"
        className="w-full flex-1 overflow-hidden p-2"
      >
        {tools?.map((tool) => (
          <AIToolMessage tool={tool} key={tool.toolName} />
        ))}

        <AISelectionProvider onSelect={handleSelection}>
          <Mdx message={rawAI} animate={!!isLoading} messageId={id} />
        </AISelectionProvider>
        {stop && <AIMessageError stopReason={stopReason} message={message} />}
        <AIMessageActions message={message} canRegenerate={message && isLast} />
        <AIRelatedQuestions message={message} show={message && isLast} />
      </Flex>
    </div>
  );
};
