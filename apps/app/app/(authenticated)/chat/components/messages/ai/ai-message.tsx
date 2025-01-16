import { useRef } from 'react';

import { Mdx } from '@/app/(authenticated)/chat/components/mdx';
import { AIMessageActions } from '@/app/(authenticated)/chat/components/messages/ai/ai-message-actions';
import { AIMessageError } from '@/app/(authenticated)/chat/components/messages/ai/ai-message-error';
import { AIRelatedQuestions } from '@/app/(authenticated)/chat/components/messages/ai/ai-related-questions';
import { AISelectionProvider } from '@/app/(authenticated)/chat/components/messages/ai/ai-selection-provider';
import { AIToolMessage } from '@/app/(authenticated)/chat/components/messages/ai/ai-tool-message';
import { ToolBadge } from '@/app/(authenticated)/chat/components/tools/tool-badge';
import { useChatContext } from '@/context';
import { useAssistantUtils } from '@/hooks';
import type { TChatMessage } from '@/types';
import { Book02Icon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';

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
      {/* <Tooltip content={runConfig.assistant.name}>
        <div className="p-2 md:px-3 md:py-2">
          {getAssistantIcon(runConfig.assistant.key, 'sm')}
        </div>
      </Tooltip> */}
      <Flex
        ref={messageRef}
        direction="col"
        gap="xs"
        items="start"
        className="w-full flex-1"
      >
        {tools?.map((tool) => (
          <AIToolMessage tool={tool} key={tool.toolName} />
        ))}

        {rawAI && <ToolBadge icon={Book02Icon} text={'Answer'} />}

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
