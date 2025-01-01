import type { AIMessage, HumanMessage } from '@langchain/core/messages';
import { get, set } from 'idb-keyval';

export const ModelType = {
  GPT3: 'gpt-3',
  GPT4: 'gpt-4',
  CLAUDE2: 'claude-2',
  CLAUDE3: 'claude-3',
} as const;

export type ModelType = (typeof ModelType)[keyof typeof ModelType];

export const PromptType = {
  ask: 'ask',
  answer: 'answer',
  explain: 'explain',
  summarize: 'summarize',
  improve: 'improve',
  fix_grammar: 'fix_grammar',
  reply: 'reply',
  short_reply: 'short_reply',
} as const;

export type PromptType = (typeof PromptType)[keyof typeof PromptType];

export const RoleType = {
  assistant: 'assistant',
  writing_expert: 'writing_expert',
  social_media_expert: 'social_media_expert',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export type PromptProps = {
  type: PromptType;
  context?: string;
  role: RoleType;
  query?: string;
  regenerate?: boolean;
};

export type TChatMessage = {
  id: string;
  model: ModelType;
  human: HumanMessage;
  ai: AIMessage;
  rawHuman: string;
  rawAI: string;
  props?: PromptProps;
  createdAt?: string;
};

export type TChatSession = {
  messages: TChatMessage[];
  title?: string;
  id: string;
  createdAt: string;
};

export const useChatSession = () => {
  const getSessions = async () => {
    return (await get('chat-sessions')) || [];
  };
  const setSession = async (chatSession: TChatSession) => {
    const sessions = await getSessions();
    const newSessions = [...sessions, chatSession];
    await set('chat-sessions', newSessions);
  };
  const getSessionById = async (id: string) => {
    const sessions = await getSessions();
    return sessions.find((session: TChatSession) => session.id === id);
  };
  const removeSessionById = async (id: string) => {
    const sessions = await getSessions();
    const newSessions = sessions.filter(
      (session: TChatSession) => session.id !== id
    );
    await set('chat-sessions', newSessions);
  };
  return { getSessions, setSession, getSessionById, removeSessionById };
};
