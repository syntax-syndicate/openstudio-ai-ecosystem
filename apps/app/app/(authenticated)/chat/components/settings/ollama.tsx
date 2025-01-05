import { usePreferenceContext } from '@/app/context/preferences/provider';
import { useLLMTest } from '@/app/hooks/use-llm-test';
import { Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { SettingsContainer } from './settings-container';

export const OllamaSettings = () => {
  const [url, setURL] = useState<string>('');
  const { preferences, updatePreferences } = usePreferenceContext();
  const { toast } = useToast();
  const { renderSaveApiKeyButton } = useLLMTest();
  useEffect(() => {
    setURL(preferences.ollamaBaseUrl);
  }, [preferences]);
  return (
    <SettingsContainer title="Ollama Settings">
      <div className="flex flex-row items-end justify-between">
        <p className="text-sm text-zinc-500 md:text-base">
          Ollama local server url
        </p>
      </div>
      <Input
        placeholder="http://localhost:11434"
        value={url}
        autoComplete="off"
        onChange={(e) => {
          setURL(e.target.value);
        }}
      />
      <div className="flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            try {
              fetch(url + '/api/tags')
                .then((res) => {
                  if (res.status === 200) {
                    console.log(res);
                    toast({
                      title: 'Success',
                      description: 'URL is valid',
                    });
                    updatePreferences({ ollamaBaseUrl: url });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  toast({
                    title: 'Error',
                    description: 'Invalid URL',
                    variant: 'destructive',
                  });
                });
            } catch (err) {
              toast({
                title: 'Error',
                description: 'Invalid URL',
                variant: 'destructive',
              });
            }
          }}
        >
          Save
        </Button>
      </div>
      <div className="flex flex-row items-start gap-1 py-2 text-zinc-500">
        <Info size={16} weight="bold" />
        <p className=" text-xs">
          Your API Key is stored locally on your browser and never sent anywhere
          else.
        </p>
      </div>
    </SettingsContainer>
  );
};
