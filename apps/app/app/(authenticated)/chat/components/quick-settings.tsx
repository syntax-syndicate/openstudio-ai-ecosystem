import { ModelInfo } from '@/app/(authenticated)/chat/components/model-info';
import { useModelSettings } from '@/app/hooks/use-model-settings';
import {
  type TPreferences,
  defaultPreferences,
} from '@/app/hooks/use-preferences';
import { Info, SlidersHorizontal } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Slider } from '@repo/design-system/components/ui/slider';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useState } from 'react';

export const QuickSettings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { formik, setPreferences, selectedModel } = useModelSettings({
    refresh: isOpen,
  });
  const renderResetToDefault = (key: keyof TPreferences) => {
    return (
      <Button
        variant="link"
        size="linkSm"
        onClick={() => {
          setPreferences({ [key]: defaultPreferences[key] });
          formik.setFieldValue(key, defaultPreferences[key]);
        }}
      >
        Reset
      </Button>
    );
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip content="Configure Model">
        <PopoverTrigger asChild>
          <Button variant="ghost" size="iconSm">
            <SlidersHorizontal size={20} weight="bold" />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="roundex-2xl mr-8 p-0 dark:bg-zinc-700">
        {selectedModel && (
          <div className="border-black/10 border-b p-3 dark:border-white/10">
            <ModelInfo model={selectedModel} showDetails={false} />
          </div>
        )}
        <div className="grid grid-cols-1 p-1">
          <div className="flex w-full flex-col rounded-2xl p-3 hover:bg-zinc-50 dark:hover:bg-black/30">
            <div className="flex w-full flex-row items-center justify-between">
              <Tooltip content="Temprature">
                <p className="flex flex-row items-center gap-1 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                  MaxTokens <Info weight="regular" size={14} />{' '}
                  {formik.values.maxTokens}
                </p>
              </Tooltip>
              {renderResetToDefault('maxTokens')}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.maxTokens)]}
              step={1}
              min={0}
              max={selectedModel?.maxOutputTokens}
              onValueChange={(value: number[]) => {
                setPreferences({ maxTokens: value?.[0] });
                formik.setFieldValue('maxTokens', value?.[0]);
              }}
            />
            <div className="flex w-full flex-row justify-between">
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Precise
              </p>
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Neutral
              </p>
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col rounded-2xl p-3 hover:bg-zinc-50 dark:hover:bg-black/30">
            <div className="flex w-full flex-row items-center justify-between">
              <Tooltip content="Temprature">
                <p className="flex flex-row items-center gap-1 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                  Temperature <Info weight="regular" size={14} />{' '}
                  {formik.values.temperature}
                </p>
              </Tooltip>
              {renderResetToDefault('temperature')}
            </div>
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
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Precise
              </p>
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Neutral
              </p>
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>{' '}
          <div className="flex w-full flex-col rounded-2xl p-3 hover:bg-zinc-50 dark:hover:bg-black/30">
            <div className="flex w-full flex-row items-center justify-between">
              <Tooltip content="TopP">
                <p className="flex flex-row items-center gap-1 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                  TopP <Info weight="regular" size={14} /> {formik.values.topP}
                </p>
              </Tooltip>
              {renderResetToDefault('topP')}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.topP)]}
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ topP: value?.[0] });
                formik.setFieldValue('topP', value?.[0]);
              }}
            />
            <div className="flex w-full flex-row justify-between">
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Precise
              </p>
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>{' '}
          <div className="flex w-full flex-col rounded-2xl p-3 hover:bg-zinc-50 dark:hover:bg-black/30">
            <div className="flex w-full flex-row items-center justify-between">
              <Tooltip content="TopK">
                <p className="flex flex-row items-center gap-1 text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                  TopK <Info weight="regular" size={14} /> {formik.values.topK}
                </p>
              </Tooltip>
              {renderResetToDefault('topK')}
            </div>
            <Slider
              className="my-2"
              value={[Number(formik.values.topK)]}
              step={0.1}
              min={0.1}
              max={1}
              onValueChange={(value: number[]) => {
                setPreferences({ topK: value?.[0] });
                formik.setFieldValue('topK', value?.[0]);
              }}
            />
            <div className="flex w-full flex-row justify-between">
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Precise
              </p>
              <p className="text-[10px] text-zinc-500 md:text-xs dark:text-zinc-600">
                Creative
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
