import { ToolBadge } from '@/app/(authenticated)/chat/components/tools/tool-badge';
import { QuoteUpSquareIcon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export type ContextMessageProps = {
  context?: string;
};

export const ContextMessage = ({ context }: ContextMessageProps) => {
  if (!context) return null;
  return (
    <Flex direction="col" gap="sm">
      <ToolBadge icon={QuoteUpSquareIcon} text="context" />
      <Type className="text-left" size="sm" textColor="secondary">
        {context}
      </Type>
    </Flex>
  );
};
