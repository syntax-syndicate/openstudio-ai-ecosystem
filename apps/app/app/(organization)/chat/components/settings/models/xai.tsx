import { ApiKeyInfo } from '@/app/(organization)/chat/components/settings/models/api-key-info';
import ApiKeyInput from '@/app/(organization)/chat/components/settings/models/api-key-input';
import { configs } from '@/config';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FormLabel } from '@repo/design-system/components/ui/form-label';
import { useEffect, useState } from 'react';

export const XAISettings = () => {
  const [key, setKey] = useState<string>('');
  const { updateApiKey, getApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  const xaiKey = getApiKey('xai');

  useEffect(() => {
    setKey(xaiKey || '');
  }, [xaiKey]);
  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="XAI API Key"
        link={configs.xaiApiKeyUrl}
        linkText="Get API key here"
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!xaiKey}
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!xaiKey}
      />
      <Flex gap="sm">
        {!xaiKey && (
          <Button
            variant="default"
            onClick={() => {
              checkApiKey({
                model: 'xai',
                key,
                onValidated: () => {
                  updateApiKey('xai', key);
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
        {xaiKey && (
          <Button
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('xai', '');
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
