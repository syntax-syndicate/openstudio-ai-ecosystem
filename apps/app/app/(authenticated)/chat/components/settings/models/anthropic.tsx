import { ApiKeyInfo } from '@/app/(authenticated)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(authenticated)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { useEffect, useState } from 'react';

export const AnthropicSettings = () => {
  const [key, setKey] = useState<string>('');
  const { updateApiKey, getApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  const anthropicKey = getApiKey('anthropic');

  useEffect(() => {
    setKey(anthropicKey || '');
  }, [anthropicKey]);

  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="Anthropic API Key"
        link={configs.anthropicApiKeyUrl}
        linkText="Get API key here"
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!anthropicKey}
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!anthropicKey}
      />

      <Flex gap="sm">
        {!anthropicKey && (
          <Button
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

        {anthropicKey && (
          <Button
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
