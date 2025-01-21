import { AiToolBlock } from '@/app/(organization)/chat/components/messages/ai/ai-tool-block';
import { useTools } from '@/hooks';
import type { ToolExecutionState } from '@/types/tools';
import { Flex } from '@repo/design-system/components/ui/flex';

type AIToolMessageProps = {
  tool: ToolExecutionState;
};
export const AIToolMessage = ({ tool }: AIToolMessageProps) => {
  const { getToolByKey } = useTools();
  const toolUsed = tool.toolName ? getToolByKey(tool.toolName) : undefined;
  if (!toolUsed) {
    return null;
  }
  const Icon = toolUsed.compactIcon;
  return (
    <Flex direction="col" items="start" gap="lg" className="w-full">
      <AiToolBlock tool={tool} definition={toolUsed} />
      {/* {toolUsed.successMessage && (
        <ToolBadge
          icon={Icon}
          isLoading={tool.isLoading}
          loadingPlaceholder={toolUsed.loadingMessage}
          text={toolUsed.successMessage}
        />
      )} */}
      {tool.renderData && toolUsed.renderComponent?.(tool.renderData)}
    </Flex>
  );
};
