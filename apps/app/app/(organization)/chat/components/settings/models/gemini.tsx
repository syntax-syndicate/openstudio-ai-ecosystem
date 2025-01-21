import { ApiKeyInfo } from '@/app/(organization)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(organization)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { useEffect, useState } from 'react';

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>('');
  const { updateApiKey, getApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  const geminiKey = getApiKey('gemini');

  useEffect(() => {
    setKey(geminiKey || '');
  }, [geminiKey]);

  return (
    <Flex direction="col" gap="sm">
      <FormLabel
        label="Google Gemini API Key"
        link={configs.geminiApiKeyUrl}
        linkText="Get API key here"
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!geminiKey}
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!geminiKey}
      />

      <Flex gap="sm">
        {!geminiKey && (
          <Button
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'gemini',
                key,
                onValidated: () => {
                  updateApiKey('gemini', key);
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

        {geminiKey && (
          <Button
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('gemini', '');
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
