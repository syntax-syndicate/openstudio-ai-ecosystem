import { ApiKeyInfo } from '@/app/(authenticated)/chat/components/settings/models/api-key-info';
import { usePreferenceContext } from '@/context/preferences';
import { useLLMTest } from '@/hooks/use-llm-test';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>('');
  const { apiKeys, updateApiKey } = usePreferenceContext();
  const { checkApiKey, isCheckingApiKey } = useLLMTest();

  useEffect(() => {
    setKey(apiKeys.gemini || '');
  }, [apiKeys.gemini]);

  return (
    <Flex direction="col" gap="sm">
      <Flex items="center" gap="sm">
        <p className="font-medium text-xs text-zinc-300 md:text-sm">
          Google Gemini API Key
        </p>
        <Link
          href="https://aistudio.google.com/app/apikey"
          className="font-medium text-blue-400"
        >
          (Get API key here)
        </Link>
      </Flex>
      <Input
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
        type="password"
        autoComplete="off"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
        }}
      />

      <div className="flex flex-row items-center gap-1">
        {!apiKeys.gemini && (
          <Button
            size="sm"
            variant="outline"
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

        {apiKeys?.gemini && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setKey('');
              updateApiKey('gemini', '');
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
