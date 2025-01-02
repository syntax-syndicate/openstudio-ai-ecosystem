import {
  defaultPreferences,
  usePreferences,
} from '@/app/hooks/use-preferences';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';
import type { JSX } from 'react';
import { ModelIcon } from '../(authenticated)/chat/components/icons/model-icon';

export type TBaseModel = 'openai' | 'anthropic' | 'gemini';
export type TModelKey =
  | 'gpt-4o'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0125'
  | 'gpt-3.5-turbo-instruct'
  | 'claude-3-opus-20240229'
  | 'claude-3-sonnet-20240229'
  | 'claude-3-haiku-20240307'
  | 'gemini-pro'
  | 'gemini-1.5-flash-latest'
  | 'gemini-1.5-pro-latest';

export type TModel = {
  name: string;
  key: TModelKey;
  isNew?: boolean;
  icon: () => JSX.Element;
  inputPrice?: number;
  outputPrice?: number;
  tokens: number;
  baseModel: TBaseModel;
};
export const useModelList = () => {
  const { getPreferences } = usePreferences();
  const createInstance = async (model: TModel, apiKey: string) => {
    const preferences = await getPreferences();
    const temperature =
      preferences.temperature || defaultPreferences.temperature;
    const topP = preferences.topP || defaultPreferences.topP;
    const topK = preferences.topK || defaultPreferences.topK;
    const maxTokens = preferences.maxTokens || model.tokens;

    switch (model.baseModel) {
      case 'openai':
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey,
          temperature,
          maxTokens,
          topP,
        });
      case 'anthropic':
        return new ChatAnthropic({
          model: model.key,
          apiKey,
          streaming: true,
          anthropicApiUrl: `${window.location.origin}/api/anthropic/`,
          temperature,
          topP,
          maxTokens,
          topK,
        });
      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: model.key,
          apiKey,
          streaming: true,
          temperature,
          topP,
          topK,
          maxOutputTokens: maxTokens,
        });
      default:
        throw new Error('Invalid model');
    }
  };
  const models: TModel[] = [
    {
      name: 'GPT 4o',
      key: 'gpt-4o',
      isNew: true,
      inputPrice: 5,
      outputPrice: 15,
      tokens: 128000,
      icon: () => <ModelIcon size="md" type="gpt4" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT4 Turbo',
      key: 'gpt-4-turbo',
      tokens: 128000,
      isNew: false,
      inputPrice: 10,
      outputPrice: 30,
      icon: () => <ModelIcon size="md" type="gpt4" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT4',
      key: 'gpt-4',
      tokens: 128000,
      isNew: false,
      inputPrice: 30,
      outputPrice: 60,
      icon: () => <ModelIcon size="md" type="gpt4" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT3.5 Turbo',
      key: 'gpt-3.5-turbo',
      isNew: false,
      inputPrice: 0.5,
      outputPrice: 1.5,
      tokens: 16385,
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT3.5 Turbo 0125',
      key: 'gpt-3.5-turbo-0125',
      isNew: false,
      tokens: 16385,
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
    },
    {
      name: 'GPT3.5 Turbo Instruct',
      key: 'gpt-3.5-turbo-instruct',
      isNew: false,
      tokens: 4000,
      inputPrice: 1.5,
      outputPrice: 2,
      icon: () => <ModelIcon size="md" type="gpt3" />,
      baseModel: 'openai',
    },
    {
      name: 'Claude 3 Opus',
      key: 'claude-3-opus-20240229',
      isNew: false,
      inputPrice: 15,
      outputPrice: 75,
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3 Sonnet',
      key: 'claude-3-sonnet-20240229',
      isNew: false,
      inputPrice: 3,
      outputPrice: 15,
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Claude 3 Haiku',
      key: 'claude-3-haiku-20240307',
      isNew: false,
      inputPrice: 0.25,
      outputPrice: 1.5,
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="anthropic" />,
      baseModel: 'anthropic',
    },
    {
      name: 'Gemini Pro 1.5',
      key: 'gemini-1.5-pro-latest',
      isNew: true,
      inputPrice: 3.5,
      outputPrice: 10.5,
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="gemini" />,
      baseModel: 'gemini',
    },
    {
      name: 'Gemini Flash 1.5',
      key: 'gemini-1.5-flash-latest',
      isNew: true,
      inputPrice: 0.35,
      outputPrice: 1.05,
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="gemini" />,
      baseModel: 'gemini',
    },
    {
      name: 'Gemini Pro',
      key: 'gemini-pro',
      isNew: false,
      inputPrice: 0.5,
      outputPrice: 1.5,
      tokens: 200000,
      icon: () => <ModelIcon size="md" type="gemini" />,
      baseModel: 'gemini',
    },
  ];
  const getModelByKey = (key: TModelKey) => {
    return models.find((model) => model.key === key);
  };
  const getTestModelKey = (key: TBaseModel): TModelKey => {
    switch (key) {
      case 'openai':
        return 'gpt-3.5-turbo';
      case 'anthropic':
        return 'claude-3-haiku-20240307';
      case 'gemini':
        return 'gemini-pro';
    }
  };
  return { models, createInstance, getModelByKey, getTestModelKey };
};
