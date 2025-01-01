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
  useEffect(() => {
    getApiKey('gemini').then((key) => {
      if (key) {
        setKey(key);
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-start gap-2 px-4">
      <p className="py-4 font-medium text-md text-white">
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
      <Button
        size="sm"
        variant="secondary"
        onClick={() => {
          window.open('https://aistudio.google.com/app/apikey', '_blank');
        }}
      >
        Get your API key here <ArrowRight size={16} weight="bold" />
      </Button>
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
