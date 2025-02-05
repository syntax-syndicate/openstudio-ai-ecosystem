export type TAssistant = {
  key: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  iconURL: string | null;
  provider: TProvider;
  baseModel: string;
  type: 'base' | 'custom';
};

export type TCustomAssistant = {
  key: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  iconURL: string | null;
  startMessage: string[] | null;
  organizationId: string;
};

export const toolKeys = ['calculator', 'web_search'];
export type ToolKey = (typeof toolKeys)[number];

export type TProvider = (typeof providers)[number];

export const providers = [
  'chathub',
  'openai',
  'anthropic',
  'gemini',
  'ollama',
  'groq',
  'meta',
  'xai',
  'perplexity',
] as const;

export type ToolExecutionState = {
  toolName: string;
  executionArgs?: Record<string, any>;
  renderData?: Record<string, any>;
  executionResult?: any;
  isLoading: boolean;
};

export type TLLMRunConfig = {
  context?: string;
  input?: string;
  image?: string;
  sessionId: string;
  messageId?: string;
  assistant: TAssistant;
};

export const stopReasons = [
  'error',
  'cancel',
  'apikey',
  'recursion',
  'finish',
  'unauthorized',
] as const;

export type TStopReason = (typeof stopReasons)[number];

export type TAIResponse = {
  assistant: TAssistant;
  rawAI: string | null;
  tools: ToolExecutionState[];
  relatedQuestions: string[];
  stopReason: TStopReason | null;
  errorMessage: string | null;
  isLoading: boolean;
  createdAt: Date;
  isComplete: boolean;
};
