import type { TAssistant, TToolResponse } from '@/types';

export type TLLMRunConfig = {
  context?: string;
  input?: string;
  image?: string;
  sessionId: string;
  messageId?: string;
  assistant: TAssistant;
};
export type TChatMessage = {
  id: string;
  image?: string;
  rawHuman?: string;
  rawAI?: string;
  sessionId: string;
  parentId: string;
  runConfig: TLLMRunConfig;
  tools?: TToolResponse[];
  isLoading?: boolean;
  stop?: boolean;
  stopReason?: 'error' | 'cancel' | 'apikey' | 'recursion' | 'finish';
  createdAt: string;
  relatedQuestions?: string[];
};
