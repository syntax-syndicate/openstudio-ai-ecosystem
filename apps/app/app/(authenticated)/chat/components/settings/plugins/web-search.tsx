import { SettingsContainer } from '@/app/(authenticated)/chat/components/settings/settings-container';
import { useModelSettings } from '@/app/hooks/use-model-settings';
import { ArrowRight, Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import axios from 'axios';

export const WebSearchPlugin = () => {
  const { toast } = useToast();
  const { formik, setPreferences } = useModelSettings({});
  const handleRunTest = async () => {
    try {
      const url = 'https://www.googleapis.com/customsearch/v1';
      const params = {
        key: formik.values.googleSearchApiKey,
        cx: formik.values.googleSearchEngineId,
        q: 'Latest news',
      };
      const response = await axios.get(url, { params });
      if (response.status === 200) {
        toast({
          title: 'Test successful',
          description: 'Google search plugin is working',
          variant: 'default',
        });
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      toast({
        title: 'Test failed',
        description: 'Google search plugin is not working',
        variant: 'destructive',
      });
    }
  };
  return (
    <SettingsContainer title="Web search plugin">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-row items-center justify-between py-2">
            <p className="flex flex-row items-center gap-1 text-sm text-zinc-500 md:text-base">
              Google Search Engine ID <Info weight="regular" size={14} />
            </p>
          </div>
          <Input
            name="googleSearchEngineId"
            type="text"
            value={formik.values.googleSearchEngineId}
            autoComplete="off"
            onChange={(e) => {
              setPreferences({ googleSearchEngineId: e.target.value });
              formik.setFieldValue('googleSearchEngineId', e.target.value);
            }}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-row items-center justify-between py-2">
            <p className="flex flex-row items-center gap-1 text-sm text-zinc-500 md:text-base">
              Google Search Api Key <Info weight="regular" size={14} />
            </p>
          </div>
          <Input
            name="googleSearchApiKey"
            type="text"
            value={formik.values.googleSearchApiKey}
            autoComplete="off"
            onChange={(e) => {
              setPreferences({ googleSearchApiKey: e.target.value });
              formik.setFieldValue('googleSearchApiKey', e.target.value);
            }}
          />
        </div>
        <Button onClick={handleRunTest} size="sm">
          Run check
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            window.open(
              'https://programmablesearchengine.google.com/controlpanel/create',
              '_blank'
            );
          }}
        >
          Get your API key here <ArrowRight size={16} weight="bold" />
        </Button>
      </div>
    </SettingsContainer>
  );
};
