import { ApiKeyInfo } from '@/app/(authenticated)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(authenticated)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const AnthropicSettings = () => {
  const [key, setKey] = useState<string>('');
  const { apiKeys, updateApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  useEffect(() => {
    setKey(apiKeys.anthropic || '');
  }, [apiKeys.anthropic]);

  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="Anthropic API Key"
        extra={() => (
          <Link
            href={configs.anthropicApiKeyUrl}
            target="_blank"
            className="font-medium text-blue-400 text-sm hover:opacity-90"
          >
            Get API key here
          </Link>
        )}
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!apiKeys.anthropic}
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!apiKeys.anthropic}
      />

      <Flex gap="sm">
        {!apiKeys.anthropic && (
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'anthropic',
                key,
                onValidated: () => {
                  updateApiKey('anthropic', key);
                },
                onError: () => {
                  setKey('');
                },
              });
            }}
          >
            {isCheckingApiKey ? 'Checking...' : 'Save Key'}
          </Button>
        )}

        {apiKeys?.anthropic && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('anthropic', '');
            }}
          >
            Remove Key
          </Button>
        )}
      </Flex>
      <ApiKeyInfo />
    </Flex>
  );
};
