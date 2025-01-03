import { useLLMTest } from '@/app/hooks/use-llm-test';
import { usePreferences } from '@/app/hooks/use-preferences';
import { ArrowRight, Info } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useEffect, useState } from 'react';

export const GeminiSettings = () => {
  const [key, setKey] = useState<string>('');
  const { getApiKey, setApiKey } = usePreferences();
  const { renderTestButton } = useLLMTest();
  useEffect(() => {
    getApiKey('gemini').then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-start gap-2 px-6">
      <p className="py-4 font-medium text-md text-zinc-800 dark:text-white">
        Google Gemini Settings
      </p>
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Google Gemini API Key</p>
      </div>
      <Input
        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
        type="password"
        autoComplete="off"
        value={key}
        onChange={(e) => {
          setKey(e.target.value);
          setApiKey('gemini', e.target.value);
        }}
      />
      <div className="flex flex-row items-center gap-2">
        {renderTestButton('gemini')}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            window.open('https://aistudio.google.com/app/apikey', '_blank');
          }}
        >
          Get your API key here <ArrowRight size={16} weight="bold" />
        </Button>
      </div>
      <Alert variant="success">
        <Info className="h-4 w-4" />
        <AlertTitle>Attention!</AlertTitle>
        <AlertDescription>
          Your API Key is stored locally on your browser and never sent anywhere
          else.
        </AlertDescription>
      </Alert>
    </div>
  );
};
