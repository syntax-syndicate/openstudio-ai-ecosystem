import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export const ApiKeyInfo = () => {
  return (
    <Flex className="text-xs" gap="xs">
      <Type size="xs" weight="bold" textColor="secondary">
        FYI:
      </Type>
      <Type size="xs" textColor="secondary" weight="medium">
        Your API Key is stored locally on your browser and never sent anywhere
        else.
      </Type>
    </Flex>
  );
};
