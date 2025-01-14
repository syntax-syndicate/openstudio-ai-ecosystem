import { ApiKeyInfo } from '@/app/(authenticated)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(authenticated)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { useEffect, useState } from 'react';

export const GroqSettings = () => {
  const [key, setKey] = useState<string>('');
  const { apiKeys, updateApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();
  useEffect(() => {
    setKey(apiKeys.groq || '');
  }, [apiKeys.groq]);
  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="Groq API Key"
        link={configs.groqApiKeyUrl}
        linkText="Get API key here"
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!apiKeys.groq}
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!apiKeys.groq}
      />
      <Flex gap="sm">
        {!apiKeys.groq && (
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'groq',
                key,
                onValidated: () => {
                  updateApiKey('groq', key);
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
              updateApiKey('groq', '');
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
