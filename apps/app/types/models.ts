import type { ModelIcon } from '@/app/(organization)/chat/components/model-icon';
import type { providers } from '@/config/models';
import type { ToolKey } from '@/types/tools';
import type { ComponentProps } from 'react';

export type TProvider = (typeof providers)[number];
export const models = [
  'o3-mini-2025-01-31',
  // 'o1-mini-2024-09-12',
  'gpt-4o-mini',
  'gpt-4o',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125',
  'claude-3-opus-20240229',
  'claude-3-sonnet-20240229',
  'claude-3-5-sonnet-20240620',
  'claude-3-haiku-20240307',
  'gemini-pro',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash-thinking-exp',
  'phi3:latest',
  'llama3-groq-70b-8192-tool-use-preview',
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
};
