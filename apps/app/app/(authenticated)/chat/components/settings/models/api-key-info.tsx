import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export const ApiKeyInfo = () => {
  return (
    <Flex className="text-xs" gap="xs">
      <Type size="xs" weight="bold" textColor="secondary"></Type>
      <Type size="xs" textColor="secondary" weight="medium"></Type>
    </Flex>
  );
};
