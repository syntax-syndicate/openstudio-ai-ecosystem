import { usePreferenceContext } from '@/context/preferences';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Input } from '@repo/design-system/components/ui/input';
import { useToast } from '@repo/design-system/hooks/use-toast';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    <Flex direction="col" gap="sm">
      <Flex items="center" gap="sm">
        <p className="text-xs text-zinc-500 md:text-sm">
          Ollama local server URL
        </p>
        <Link
          href="https://aistudio.google.com/app/apikey"
          className="font-medium text-blue-400"
        >
          (Configuration guide)
        </Link>
      </Flex>
      <Input
        placeholder="http://localhost:11434"
        value={url}
        autoComplete="off"
        onChange={handleURLChange}
      />
      <div className="flex flex-row items-center gap-2">
        <Button size="sm" variant="outline" onClick={verifyAndSaveURL}>
          Check Connection
        </Button>
      </div>
    </Flex>
  );
};
