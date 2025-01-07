import { Flex } from '@repo/design-system/components/ui/flex';

export const ApiKeyInfo = () => {
  return (
    <Flex className="text-xs" gap="xs">
      <p className="font-semibold text-zinc-500">FYI:</p>
      <p className="font-medium text-xs text-zinc-300">
        Your API Key is stored locally on your browser and never sent anywhere
        else.
      </p>
    </Flex>
  );
};
