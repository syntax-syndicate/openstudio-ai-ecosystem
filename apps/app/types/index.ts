export * from '@/types/assistants';
export * from '@/types/messages';
export * from '@/types/models';
export * from '@/types/preferences';
export * from '@/types/sessions';
export * from '@/types/tools';
export * from '@/types/documents';
export * from '@/types/export';
export * from '@/types/prompt';
export * from '@/types/attachment';

export enum TStopReason {
  Error = 'error',
  Cancel = 'cancel',
  ApiKey = 'apikey',
  Recursion = 'recursion',
  Finish = 'finish',
  RateLimit = 'rateLimit',
  Unauthorized = 'unauthorized',
  Length = 'length',
  Stop = 'stop',
  FunctionCall = 'function_call',
  ContentFilter = 'content_filter',
  ToolCalls = 'tool_calls',
}

export type ApiKey = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  key: string;
  organizationId: string;
};
