import { ApiKeyInfo } from '@/app/(organization)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(organization)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { useEffect, useState } from 'react';

export const PerplexitySettings = () => {
  const [key, setKey] = useState<string>('');
  const { updateApiKey, getApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  const perplexityKey = getApiKey('perplexity');

  useEffect(() => {
    setKey(perplexityKey || '');
  }, [perplexityKey]);
  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="Perplexity API Key"
        link={configs.perplexityApiKeyUrl}
        linkText="Get API key here"
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!perplexityKey}
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!perplexityKey}
      />
      <Flex gap="sm">
        {!perplexityKey && (
          <Button
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'perplexity',
                key,
                onValidated: () => {
                  updateApiKey('perplexity', key);
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
        {perplexityKey && (
          <Button
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('perplexity', '');
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
