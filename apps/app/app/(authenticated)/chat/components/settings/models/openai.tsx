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

export const OpenAISettings = () => {
  const [key, setKey] = useState<string>('');
  const { apiKeys, updateApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  useEffect(() => {
    setKey(apiKeys.openai || '');
  }, [apiKeys.openai]);

  return (
    <Flex direction="col" gap="md">
      <FormLabel
        label="Open AI API Key"
        extra={() => (
          <Link
            href={configs.openaiApiKeyUrl}
            className="font-medium text-blue-400 text-sm hover:opacity-90"
          >
            Get API key here
          </Link>
        )}
      />
      <ApiKeyInput
        value={key}
        setValue={setKey}
        isDisabled={!!apiKeys.openai}
        placeholder="Sk-xxxxxxxxxxxxxxxxxxxxxxxx"
        isLocked={!!apiKeys.openai}
      />

      <div className="flex flex-row items-center gap-1">
        {!apiKeys.openai && (
          <Button
            size="sm"
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

        {apiKeys?.openai && (
          <Button
            size="sm"
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
