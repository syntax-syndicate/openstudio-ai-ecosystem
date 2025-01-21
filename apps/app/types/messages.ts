import type { TAssistant, ToolExecutionState } from '@/types';
import type { schema } from '@repo/backend/schema';

export const stopReasons = [
  'error',
  'cancel',
  'apikey',
  'recursion',
  'finish',
  'unauthorized',
] as const;

export type TStopReason = (typeof stopReasons)[number];

export type TLLMRunConfig = {
  context?: string;
  input?: string;
  image?: string;
  sessionId: string;
  messageId?: string;
  assistant: TAssistant;
};

export type TChatMessage =
  | (typeof schema.chatMessages.$inferSelect & {
      runConfig: TLLMRunConfig;
      tools?: ToolExecutionState[];
    })
  | typeof schema.chatMessages.$inferSelect;

export type TLegacyChatMessage = {
  id: string;
  image: string | null;
  rawHuman: string | null;
  rawAI: string | null;
  sessionId: string;
  parentId: string | null;
  runConfig: TLLMRunConfig | any;
  tools: ToolExecutionState[] | any;
  isLoading: boolean;
  stop: boolean;
  stopReason: TStopReason;
  errorMessage: string | null;
  createdAt: Date;
  relatedQuestions: string[] | any;
};
