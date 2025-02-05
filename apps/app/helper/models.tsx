import type { TModelKey, TProvider } from '@/types';

export const getTestModelKey = (key: TProvider): TModelKey => {
  switch (key) {
    case 'openai':
        return 'gpt-3.5-turbo-0125';
      case 'anthropic':
        return 'claude-3-haiku-20240307';
      case 'gemini':
        return 'gemini-1.5-pro';
      case 'ollama':
        return 'phi3:latest';
      case 'chathub':
        return 'chathub';
      case 'groq':
        return 'llama-3.3-70b-versatile';
      case 'meta':
        return 'llama-3.3-70b-versatile';
      case 'deepseek':
        return 'deepseek-r1-distill-llama-70b';
      case 'xai':
        return 'grok-2-latest';
      case 'perplexity':
        return 'sonar-reasoning-pro';
    default:
      throw new Error('Invalid base model');
  }
};
