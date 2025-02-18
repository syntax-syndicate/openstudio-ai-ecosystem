import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

export const createProvider = (provider: string, apiKey: any) => {
  switch (provider) {
    case 'openai':
      return createOpenAI({
        apiKey: apiKey.key,
        compatibility: 'strict',
        baseURL: `https://gateway.ai.cloudflare.com/v1/b8a66f8a4ddbd419ef8e4bdfeea7aa60/chathub/openai`,
      });
    case 'anthropic':
      return createAnthropic({
        apiKey: apiKey.key,
        baseURL: `https://gateway.ai.cloudflare.com/v1/b8a66f8a4ddbd419ef8e4bdfeea7aa60/chathub/anthropic`,
      });
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
};
