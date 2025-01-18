import { usePreferenceContext } from '@/context';
import { useRootContext } from '@/context/root';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { Plug } from 'lucide-react';

export const ApiKeyInfo = () => {
  const { setOpenApiKeyModal, setApiKeyModalProvider } = useRootContext();
  const { apiKeys, preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const assistant = getAssistantByKey(preferences.defaultAssistant);
  const hasApiKeys =
    apiKeys.filter(
      (key) => assistant?.model.provider === key.provider && key.key
    ).length > 0;

  if (preferences.defaultAssistant === 'chathub') {
    return (
      <Flex className="w-full" justify="between" items="center">
        <Type
          size="xs"
          textColor="secondary"
          className="rounded-full bg-zinc-50 px-3 py-1.5 text-center"
        >
          OpenStudio ChatHub is free to use with limited access, bring your own
          API key for unlimited access.
        </Type>
        <Button
          variant="link"
          size="xs"
          className="text-teal-600"
          onClick={() => {
            window.location.href =
              window.location.origin + '/chat/settings/llms';
          }}
        >
          Manage API Keys
        </Button>
      </Flex>
    );
  }

  if (hasApiKeys) {
    return null;
  }

  return (
    <Flex className="p-2" justify="between" items="center">
      {assistant?.model.provider && (
        <Button
          rounded="full"
          size="xs"
          className="px-3"
          onClick={() => {
            setOpenApiKeyModal(true);
            setApiKeyModalProvider(assistant?.model.provider);
          }}
        >
          <Plug size={14} /> Set API Key
        </Button>
      )}
    </Flex>
  );
};
