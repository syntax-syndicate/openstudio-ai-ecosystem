import {
  defaultPreferences,
  usePreferences,
} from '@/app/hooks/use-preferences';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Slider } from '@repo/design-system/components/ui/slider';
import { Switch } from '@repo/design-system/components/ui/switch';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { useFormik } from 'formik';
import { useEffect } from 'react';

export const CommonSettings = () => {
  const { getPreferences, setPreferences } = usePreferences();
  const formik = useFormik({
    initialValues: {
      systemPrompt: '',
      messageLimit: 'all',
      temperature: 0.5,
      topP: 1,
      topK: 5,
    },
    onSubmit: (values) => {},
  });
  useEffect(() => {
    getPreferences().then((preferences) => {
      formik.setFieldValue(
        'systemPrompt',
        preferences.systemPrompt || defaultPreferences.systemPrompt
      );
      formik.setFieldValue(
        'messageLimit',
        preferences.messageLimit || defaultPreferences.messageLimit
      );
      formik.setFieldValue(
        'temperature',
        preferences.temperature || defaultPreferences.temperature
      );
      formik.setFieldValue('topP', preferences.topP || defaultPreferences.topP);
      formik.setFieldValue('topK', preferences.topK || defaultPreferences.topK);
    });
  }, []);
  return (
    <div className="flex h-full flex-col items-start gap-2 overflow-y-auto px-6 pb-12">
      <p className="py-4 font-medium text-md text-white">Default Settings</p>
      <div className="flex w-full flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">System Default Prompt</p>
        <Button variant="secondary" size="sm">
          Reset to Default
        </Button>
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
      <div className="flex w-full flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Messages Limit</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPreferences({ messageLimit: defaultPreferences.messageLimit });
            formik.setFieldValue(
              'messageLimit',
              defaultPreferences.messageLimit
            );
          }}
        >
          Reset to Default
        </Button>
      </div>
      <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-white/5 p-3">
        <div className="flex w-full flex-row justify-between">
          {' '}
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
            <p className="text-xs text-zinc-500">Message Limit</p>
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
      <div className="flex w-full flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">Temperature</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPreferences({ temperature: defaultPreferences.temperature });
            formik.setFieldValue('temperature', defaultPreferences.temperature);
          }}
        >
          Reset to Default
        </Button>
      </div>
      <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-white/5 p-3">
        <p className="font-medium text-white text-xl">
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
          <p className="text-xs text-zinc-500">Precise</p>
          <p className="text-xs text-zinc-500">Neutral</p>
          <p className="text-xs text-zinc-500">Creative</p>
        </div>
        <p className="text-xs text-zinc-500">
          Higher values like 0.8 will make the output more random, while lower
          values like 0.2 will make it more focused and deterministic.
        </p>
      </div>
      <div className="flex w-full flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">TopP</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPreferences({ topP: defaultPreferences.topP });
            formik.setFieldValue('topP', defaultPreferences.topP);
          }}
        >
          Reset to Default
        </Button>
      </div>
      <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-white/5 p-3">
        <p className="font-medium text-white text-xl">{formik.values.topP}</p>
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
          <p className="text-xs text-zinc-500">Precise</p>
          <p className="text-xs text-zinc-500">Creative</p>
        </div>
        <p className="text-xs text-zinc-500">
          An alternative to sampling with temperature, called nucleus sampling,
          where the model considers the results of the tokens with top_p
          probability mass. So 0.1 means only the tokens comprising the top 10%
          probability mass are considered.
        </p>
      </div>
      <div className="flex w-full flex-row items-end justify-between">
        <p className="text-xs text-zinc-500">TopK</p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPreferences({ topK: defaultPreferences.topK });
            formik.setFieldValue('topK', defaultPreferences.topK);
          }}
        >
          Reset to Default
        </Button>
      </div>
      <div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-white/5 p-3">
        <p className="font-medium text-white text-xl">{formik.values.topK}</p>
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
          <p className="text-xs text-zinc-500">Precise</p>
          <p className="text-xs text-zinc-500">Creative</p>
        </div>
        <p className="text-xs text-zinc-500">
          An alternative to sampling with temperature, called nucleus sampling,
          where the model considers the results of the tokens with top_p
          probability mass. So 0.1 means only the tokens comprising the top 10%
          probability mass are considered.
        </p>
      </div>
    </div>
  );
};
