import { ToolBadge } from '@/app/(authenticated)/chat/components/tools/tool-badge';
import { useTools } from '@/hooks';
import type { TToolResponse } from '@/types';
import { Flex } from '@repo/design-system/components/ui/flex';

type TAIToolMessage = {
  tool: TToolResponse;
};

export const AIToolMessage = ({ tool }: TAIToolMessage) => {
  const { getToolInfoByKey } = useTools();

  const toolUsed = tool?.toolName
    ? getToolInfoByKey(tool?.toolName)
    : undefined;

  if (!toolUsed) {
    return null;
  }

  const Icon = toolUsed.smallIcon;

  return (
    <Flex direction="col" items="start" gap="sm" className="mb-4 w-full">
      {toolUsed?.resultMessage && (
        <ToolBadge
          icon={Icon}
          isLoading={tool?.toolLoading}
          loadingPlaceholder={toolUsed.loadingMessage}
          text={toolUsed.resultMessage}
        />
      )}

      {toolUsed &&
        tool?.toolRenderArgs &&
        toolUsed?.renderUI?.(tool?.toolRenderArgs)}
    </Flex>
  );
};
