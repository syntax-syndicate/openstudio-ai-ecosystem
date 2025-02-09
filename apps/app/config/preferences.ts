import type { TPreferences } from '@/types';

export const defaultPreferences: Omit<TPreferences, 'id' | 'organizationId'> = {
  defaultAssistant: 'chathub',
  defaultAssistants: ['chathub'],
  systemPrompt:
    ` 
You are a helpful assistant that answers my questions accurately. Today is {{local_date}}.  

Rules for Context Usage:  
1. Only consider previous messages if the latest message is unclear or explicitly references prior context.  
2. If the latest message is clear and self-contained, ignore all previous messages entirely.  
3. Do not mention whether you are considering or ignoring previous messages—just respond directly to the latest message.  
4. Answer concisely and accurately without requesting clarifications unless absolutely necessary.`,
  messageLimit: 5,
  temperature: '0.5',
  suggestRelatedQuestions: true,
  generateTitle: true,
  memories: [],
  dalleImageQuality: 'standard',
  dalleImageSize: '1024x1024',
  ollamaBaseUrl: 'http://localhost:11434',
  whisperSpeechToTextEnabled: false,
  googleSearchEngineId: null,
  googleSearchApiKey: null,
  defaultWebSearchEngine: 'duckduckgo',
  defaultPlugins: [],
  maxTokens: 2000,
  topP: '1.0',
  topK: '5',
};

export const defaultKeys = {
  ollama: 'ollama',
  chathub: 'chathub',
};
