import { usePreferenceContext } from '@/context';
import { useAssistantUtils } from '@/hooks/use-assistant-utils';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import Link from 'next/link';

export const ApiKeyInfo = () => {
  const { apiKeys, preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const assistant = getAssistantByKey(preferences.defaultAssistant);
  const hasApiKeys =
    apiKeys.filter(
      (key) => assistant?.model.provider === key.provider && key.key
    ).length > 0;

  if (preferences.defaultAssistant === 'chathub') {
    return (
      <Flex className="w-full py-2 pr-1 pl-3" justify="between" items="center">
        <Type size="xs" textColor="secondary">
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
    <Flex className="w-full py-1 pr-1 pl-3" justify="between" items="center">
      <Type size="xs" textColor="secondary">
        Use your own {assistant?.model.provider} API key or try{' '}
        <Link
          href={window.location.origin + '/chat/settings/llms/ollama'}
          className="inline-block px-1 underline decoration-zinc-500/20 underline-offset-2"
        >
          Ollama
        </Link>{' '}
        for unlimited local access.
      </Type>
      <Button
        variant="link"
        size="xs"
        className="text-teal-600"
        onClick={() => {
          window.location.href =
            window.location.origin +
            '/chat/settings/llms/' +
            assistant?.model.provider;
        }}
      >
        Add API Key
      </Button>
    </Flex>
  );
};
