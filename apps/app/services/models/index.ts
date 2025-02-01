import { defaultPreferences } from '@/config';
import type { TModelItem, TModelKey, TPreferences, TProvider } from '@/types';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
type ChatOpenAIConstructorParams = ConstructorParameters<typeof ChatOpenAI>[0];
type ChatAnthropicConstructorParams = ConstructorParameters<
  typeof ChatAnthropic
>[0];
type ChatGoogleGenerativeAIConstructorParams = ConstructorParameters<
  typeof ChatGoogleGenerativeAI
>[0];
type ChatOllamaConstructorParams = ConstructorParameters<typeof ChatOllama>[0];
type ChatGroqConstructorParams = ConstructorParameters<typeof ChatGroq>[0];

type TCreateInstance = {
  model: Omit<TModelItem, 'provider'>;
  preferences?: Partial<TPreferences>;
  apiKey?: string;
  provider: TProvider;
} & (
  | {
      provider: 'openai';
      props?: Partial<ChatOpenAIConstructorParams>;
    }
  | {
      provider: 'chathub';
      props?: Partial<ChatOpenAIConstructorParams>;
    }
  | {
      provider: 'anthropic';
      props?: Partial<ChatAnthropicConstructorParams>;
    }
  | {
      provider: 'gemini';
      props?: Partial<ChatGoogleGenerativeAIConstructorParams>;
    }
  | {
      provider: 'ollama';
      props?: Partial<ChatOllamaConstructorParams>;
    }
  | {
      provider: 'groq';
      props?: Partial<ChatGroqConstructorParams>;
    }
);

export class ModelService {
  async createInstance({
    model,
    provider,
    preferences,
    apiKey,
    ...props
  }: TCreateInstance) {
    const { temperature, topP, topK, ollamaBaseUrl, ...rest } = {
      ...defaultPreferences,
      ...preferences,
    };

    const maxTokens =
      rest.maxTokens <= model.maxOutputTokens
        ? rest.maxTokens
        : model.maxOutputTokens;

    switch (provider) {
      case 'chathub':
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey: 'ssdlk',
          configuration: {
            baseURL: `${window.location.origin}/api/chathub/`,
          },
          temperature: Number(temperature),
          maxTokens,
          topP: Number(topP),
          maxRetries: 2,
          ...props,
        });
      case 'openai':
        return new ChatOpenAI({
          model: model.key,
          streaming: true,
          apiKey,
          ...(!model.key.startsWith('o3-') && !model.key.startsWith('o1-') && {
            temperature: Number(temperature),
          }),
          ...(model.key.startsWith('o3-mini-') || model.key.startsWith('o1-')
            ? { maxCompletionTokens: maxTokens }
            : { maxTokens }),
          topP: Number(topP),
          maxRetries: 2,
          ...props,
        });
      case 'anthropic':
        return new ChatAnthropic({
          model: model.key,
          // anthropicApiUrl: `${window.location.origin}/api/anthropic/`,
          apiKey,
          maxTokens,
          clientOptions: {
            defaultHeaders: {
              'anthropic-dangerous-direct-browser-access': 'true',
            },
          },
          streaming: true,
          temperature: Number(temperature),
          topP: Number(topP),
          topK: Number(topK),
          maxRetries: 2,
          ...props,
        });
      case 'gemini':
        return new ChatGoogleGenerativeAI({
          model: model.key,
          apiKey,
          maxOutputTokens: maxTokens,
          streaming: true,
          temperature: Number(temperature),
          maxRetries: 1,
          onFailedAttempt: (error) => {
            console.error('Failed attempt', error);
          },
          topP: Number(topP),
          topK: Number(topK),
          ...props,
        });
      case 'ollama':
        return new ChatOllama({
          model: model.key,
          baseUrl: ollamaBaseUrl,
          numPredict: maxTokens,
          topK: Number(topK),
          topP: Number(topP),
          maxRetries: 2,
          temperature: Number(temperature),
          ...props,
        });
      case 'groq':
        return new ChatGroq({
          model: model.key,
          apiKey,
          streaming: true,
          maxTokens: maxTokens,
          maxRetries: 2,
          temperature: Number(temperature),
          ...props,
        });
      default:
        throw new Error('Invalid model');
    }
  }
  getTestModelKey(key: TProvider): TModelKey {
    switch (key) {
      case 'openai':
        return 'gpt-3.5-turbo';
      case 'anthropic':
        return 'claude-3-haiku-20240307';
      case 'gemini':
        return 'gemini-pro';
      case 'ollama':
        return 'phi3:latest';
      case 'chathub':
        return 'chathub';
      case 'groq':
        return 'llama3-8b-8192';
    }
  }
}
export const modelService = new ModelService();
