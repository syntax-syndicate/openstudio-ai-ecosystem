import { ApiKeyInfo } from '@/app/(authenticated)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(authenticated)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { useEffect, useState } from 'react';

export const OpenAISettings = () => {
  const [key, setKey] = useState<string>('');
  const { apiKeys, updateApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  const openaiKey = apiKeys?.find((key) => key.provider === 'openai')?.key;

  useEffect(() => {
    setKey(openaiKey || '');
  }, [openaiKey]);

  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="Open AI API Key"
        link={configs.openaiApiKeyUrl}
        linkText="Get API key here"
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!openaiKey}
        placeholder="Sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!openaiKey}
      />

      <div className="flex flex-row items-center gap-1">
        {!openaiKey && (
          <Button
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'openai',
                key,
                onValidated: () => {
                  updateApiKey('openai', key);
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

        {openaiKey && (
          <Button
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('openai', '');
            }}
          >
            Remove Key
          </Button>
        )}
      </div>
      <ApiKeyInfo />
    </Flex>
  );
};
