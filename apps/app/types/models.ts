import type { ModelIcon } from '@/app/(organization)/chat/components/model-icon';
import type { providers } from '@/config/models';
import type { ToolKey } from '@/types/tools';
import type { ComponentProps } from 'react';

export type TProvider = (typeof providers)[number];
export const models = [
  'o3-mini-2025-01-31',
  'gpt-4o-mini',
  'gpt-4',
  'gpt-4-turbo',
  'grok-2-latest',
  'grok-2-vision-latest',
  'gpt-3.5-turbo-0125',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-5-sonnet-20240620',
  'claude-3-5-sonnet-20241022',
  'claude-3-haiku-20240307',
  'claude-3-5-haiku-20241022',
  'gemini-2.0-flash-thinking-exp-01-21',
  'gemini-2.0-flash-lite-preview-02-05',
  'gemini-2.0-pro-exp-02-05',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash',
  'gemini-exp-1206',
  'learnlm-1.5-pro-experimental',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'llama-3.2-90b-vision-preview',
  'llama-3.3-70b-versatile',
  'deepseek-r1-distill-llama-70b',
  'phi3:latest',
  'sonar-reasoning-pro',
  'sonar-pro',
] as const;
export type TModelKey = (typeof models)[number] | string;
export type TModelItem = {
  name: string;
  key: TModelKey;
  description?: string;
  isNew?: boolean;
  isFree?: boolean;
  icon: ComponentProps<typeof ModelIcon>['type'];
  vision?: boolean;
  tokens: number;
  plugins: ToolKey[];
  provider: TProvider;
  maxOutputTokens: number;
  inputTokenPrice: number;
  outputTokenPrice: number;
};
