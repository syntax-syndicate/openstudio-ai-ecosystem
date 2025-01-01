'use client';

import type { PromptProps, TChatSession } from '@/app/hooks/use-chat-session';
import type { TStreamProps } from '@/app/hooks/use-llm';
import { createContext, useContext } from 'react';

export type TChatContext = {
  chatSession: TChatSession[];
  sessions: TChatSession[];
  refetchSessions: () => void;
  isSessionLoading: boolean;
  createSession: () => Promise<TChatSession>;
  clearChatSessions: () => Promise<void>;
  currentSession: TChatSession | undefined;
  streamingMessage?: TStreamProps;
  runModel: (props: PromptProps, sessionId: string) => Promise<void>;
};
export const ChatContext = createContext<TChatContext | undefined>(undefined);
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
