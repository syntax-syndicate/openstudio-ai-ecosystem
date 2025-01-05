import { usePreferenceContext } from '@/app/context/preferences';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { SettingsContainer } from './settings-container';

export const OllamaSettings = () => {
  const [url, setURL] = useState<string>('');
  const { preferences, updatePreferences } = usePreferenceContext();
  const { toast } = useToast();
  useEffect(() => {
    setURL(preferences.ollamaBaseUrl);
  }, [preferences]);

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  };
  const verifyAndSaveURL = async () => {
    try {
      const response = await fetch(url + '/api/tags');
      if (response.status === 200) {
        console.log(response);
        toast({
          title: 'Success',
          description: 'Ollama server endpoint is valid',
        });
        updatePreferences({ ollamaBaseUrl: url });
      } else {
        throw new Error('Response status is not 200');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Invalid Ollama server endpoint',
        variant: 'destructive',
      });
    }
  };

  return (
    <SettingsContainer title="Ollama Settings">
      <div className="flex flex-row items-end justify-between">
        <p className="text-xs text-zinc-500 md:text-sm">
          Ollama local server URL
        </p>
      </div>
      <Input
        placeholder="http://localhost:11434"
        value={url}
        autoComplete="off"
        onChange={handleURLChange}
      />
      <div className="flex flex-row items-center gap-2">
        <Button size="sm" onClick={verifyAndSaveURL}>
          Save & Check Connection
        </Button>
      </div>
      {/* TODO: Add FAQ Section with q and a here you can use Type Component */}
    </SettingsContainer>
  );
};
