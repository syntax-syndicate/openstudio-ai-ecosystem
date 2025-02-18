import { defaultPreferences } from '@/config';
import { env } from '@/env';
import type { TModelItem, TModelKey, TPreferences, TProvider } from '@/types';
import type { ChatAnthropic } from '@langchain/anthropic';
import type { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { ChatGroq } from '@langchain/groq';
import type { ChatOllama } from '@langchain/ollama';
import type { ChatOpenAI } from '@langchain/openai';
import type { ChatXAI } from '@langchain/xai';
import { createOpenAI } from '@repo/ai';
type ChatOpenAIConstructorParams = ConstructorParameters<typeof ChatOpenAI>[0];
type ChatAnthropicConstructorParams = ConstructorParameters<
  typeof ChatAnthropic
>[0];
type ChatGoogleGenerativeAIConstructorParams = ConstructorParameters<
  typeof ChatGoogleGenerativeAI
>[0];
type ChatOllamaConstructorParams = ConstructorParameters<typeof ChatOllama>[0];
type ChatGroqConstructorParams = ConstructorParameters<typeof ChatGroq>[0];
type ChatXAIConstructorParams = ConstructorParameters<typeof ChatXAI>[0];

type TCreateInstance = {
  model: Omit<TModelItem, 'provider'>;
  preferences?: Partial<TPreferences>;
  apiKey?: string;
  provider: TProvider;
  isPremium?: boolean;
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
  | {
      provider: 'meta';
      props?: Partial<ChatGroqConstructorParams>;
    }
  | {
      provider: 'deepseek';
      props?: Partial<ChatOpenAIConstructorParams>;
    }
  | {
      provider: 'xai';
      props?: Partial<ChatOpenAIConstructorParams>;
    }
  | {
      provider: 'perplexity';
      props?: Partial<ChatOpenAIConstructorParams>;
    }
);

export class ModelService {
  async createInstance({
    model,
    provider,
    preferences,
    apiKey,
    isPremium,
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
      // case 'chathub':
      //   return new ChatOpenAI({
      //     model: model.key,
      //     streaming: true,
      //     apiKey: 'ssdlk',
      //     configuration: {
      //       baseURL: `${window.location.origin}/api/chathub/`,
      //     },
      //     temperature: Number(temperature),
      //     maxTokens,
      //     topP: Number(topP),
      //     maxRetries: 2,
      //     ...props,
      //   });
      case 'openai':
        // return new ChatOpenAI({
        //   model: model.key,
        //   streaming: true,
        //   configuration: {
        //     baseURL: `https://gateway.ai.cloudflare.com/v1/b8a66f8a4ddbd419ef8e4bdfeea7aa60/chathub/openai`,
        //   },
        //   apiKey: isPremium ? this.getModelAPIKeyForProUsers(provider) : apiKey,
        //   ...(!model.key.startsWith('o3-') &&
        //     !model.key.startsWith('o1-') && {
        //       temperature: Number(temperature),
        //     }),
        //   ...(model.key.startsWith('o3-mini-') || model.key.startsWith('o1-')
        //     ? { maxCompletionTokens: maxTokens }
        //     : { maxTokens }),
        //   topP: Number(topP),
        //   maxRetries: 2,
        //   ...props,
        // });
        return createOpenAI({
          apiKey: isPremium ? this.getModelAPIKeyForProUsers(provider) : apiKey,
          compatibility: 'strict',
          baseURL: `https://gateway.ai.cloudflare.com/v1/b8a66f8a4ddbd419ef8e4bdfeea7aa60/chathub/openai`,
        });
      default:
        throw new Error('Invalid model');
    }
  }
  getTestModelKey(key: TProvider): TModelKey {
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
      default:
        return 'gpt-3.5-turbo-0125';
    }
  }

  getModelAPIKeyForProUsers(key: TProvider): string {
    switch (key) {
      case 'openai':
        return env.NEXT_PUBLIC_OPENAI_API_KEY!;
      case 'anthropic':
        return env.NEXT_PUBLIC_ANTHROPIC_API_KEY!;
      case 'gemini':
        return env.NEXT_PUBLIC_GEMINI_API_KEY!;
      case 'groq':
        return env.NEXT_PUBLIC_GROQ_API_KEY!;
      case 'xai':
        return env.NEXT_PUBLIC_XAI_API_KEY!;
      case 'perplexity':
        return env.NEXT_PUBLIC_PERPLEXITY_API_KEY!;
      default:
        return '';
    }
  }
}
export const modelService = new ModelService();
