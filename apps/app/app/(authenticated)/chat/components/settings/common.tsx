import { useModelSettings } from '@/app/hooks/use-model-settings';
import {
  type TPreferences,
  defaultPreferences,
} from '@/app/hooks/use-preferences';
import { Info } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Slider } from '@repo/design-system/components/ui/slider';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';

export const CommonSettings = () => {
  const { formik, setPreferences } = useModelSettings({});

  const renderResetToDefault = (key: keyof TPreferences) => {
    return (
      <Button
        variant="link"
        size="sm"
        onClick={() => {
          setPreferences({ [key]: defaultPreferences[key] });
          formik.setFieldValue(key, defaultPreferences[key]);
        }}
      >
        Reset to Default
      </Button>
    );
  };

  return (
    <div className="no-scrollbar flex h-full flex-col items-start gap-2 overflow-y-auto px-6 pb-12">
      <p className="py-4 font-medium text-md text-zinc-600 dark:text-white">
        Default Settings
      </p>

      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="flex flex-row items-center gap-1 text-xs text-zinc-500">
            System Default Prompt <Info weight="regular" size={14} />
          </p>
          {renderResetToDefault('systemPrompt')}
        </div>
        <Textarea
          name="systemPrompt"
          value={formik.values.systemPrompt}
          autoComplete="off"
          onChange={(e) => {
            setPreferences({ systemPrompt: e.target.value });
            formik.setFieldValue('systemPrompt', e.target.value);
          }}
        />
      </div>

      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="flex flex-row items-center gap-2 text-xs text-zinc-500">
            Messages Limit
          </p>
          {renderResetToDefault('messageLimit')}
        </div>

        <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
          <div className="flex w-full flex-row justify-between">
            <p className="text-sm">Use all Previous Messages</p>
            <Switch
              checked={formik.values.messageLimit === 'all'}
              onCheckedChange={(checked) => {
                setPreferences({ messageLimit: checked ? 'all' : 4 });
                formik.setFieldValue('messageLimit', checked ? 'all' : 4);
              }}
            />
          </div>
          {formik.values.messageLimit !== 'all' && (
            <>
              <p className="flex flex-row items-center gap-2 text-xs text-zinc-500">
                Message Limit <Info weight="regular" size={14} />
              </p>

              <Input
                name="messageLimit"
                type="number"
                value={formik.values.messageLimit}
                autoComplete="off"
                onChange={(e) => {
                  setPreferences({ messageLimit: Number(e.target.value) });
                  formik.setFieldValue('messageLimit', Number(e.target.value));
                }}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="flex flex-row items-center gap-1 text-xs text-zinc-500">
            Max Tokens <Info weight="regular" size={14} />
          </p>
          {renderResetToDefault('maxTokens')}
        </div>

        <Input
          name="maxTokens"
          type="number"
          value={formik.values.maxTokens}
          autoComplete="off"
          onChange={(e) => {
            setPreferences({ maxTokens: Number(e.target.value) });
            formik.setFieldValue('maxTokens', Number(e.target.value));
          }}
        />
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="flex flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            <Tooltip content="Temprature">
              <p className="flex flex-row items-center gap-1 text-xs text-zinc-500">
                Temperature <Info weight="regular" size={14} />
              </p>
            </Tooltip>
            {renderResetToDefault('temperature')}
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
            <p className="font-medium text-xl text-zinc-600 dark:text-white">
              {formik.values.temperature}
            </p>
            <Slider
              className="my-2"
              value={[Number(formik.values.temperature)]}
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ temperature: value?.[0] });
                formik.setFieldValue('temperature', value?.[0]);
              }}
            />
            <div className="flex w-full flex-row justify-between">
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Precise
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Neutral
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            <Tooltip content="TopP">
              <p className="flex flex-row items-center gap-1 text-xs text-zinc-500">
                TopP <Info weight="regular" size={14} />
              </p>
            </Tooltip>
            {renderResetToDefault('topP')}
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
            <p className="font-medium text-xl text-zinc-600 dark:text-white">
              {formik.values.topP}
            </p>
            <Slider
              className="my-2"
              value={[Number(formik.values.topP)]}
              min={0}
              name="topP"
              step={0.01}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ topP: value?.[0] });
                formik.setFieldValue('topP', value?.[0]);
              }}
            />
            <div className="flex w-full flex-row justify-between">
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Precise
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex w-full flex-row items-center justify-between">
            <Tooltip content="TopK">
              <p className="flex flex-row items-center gap-1 text-xs text-zinc-500">
                TopK <Info weight="regular" size={14} />
              </p>
            </Tooltip>
            {renderResetToDefault('topK')}
          </div>
          <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
            <p className="font-medium text-xl text-zinc-600 dark:text-white">
              {formik.values.topK}
            </p>
            <Slider
              className="my-2"
              value={[Number(formik.values.topK)]}
              min={0}
              step={1}
              max={100}
              onValueChange={(value: number[]) => {
                setPreferences({ topK: value?.[0] });
                formik.setFieldValue('topK', value?.[0]);
              }}
            />
            <div className="flex w-full flex-row justify-between">
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Precise
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
