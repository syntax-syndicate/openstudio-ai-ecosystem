import { ToolBadge } from '@/app/(authenticated)/chat/components/tools/tool-badge';
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
    <Flex direction="col" items="start" gap="sm" className="mb-4 w-full">
      {toolUsed?.successMessage && (
        <ToolBadge
          icon={Icon}
          isLoading={tool?.isLoading}
          loadingPlaceholder={toolUsed.loadingMessage}
          text={toolUsed.successMessage}
        />
      )}

      {tool.renderData && toolUsed.renderComponent?.(tool.renderData)}
    </Flex>
  );
};
