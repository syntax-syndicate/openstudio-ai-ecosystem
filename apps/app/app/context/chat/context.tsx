'use client';

import type { TBot } from '@/app/hooks/use-bots';
import type { TChatSession } from '@/app/hooks/use-chat-session';
import type { TRunModel } from '@/app/hooks/use-llm';
import type { Editor } from '@tiptap/react';
import { createContext, useContext } from 'react';

export type TChatContext = {
  sessions: TChatSession[];
  refetchSessions: () => void;
  isAllSessionLoading: boolean;
  isCurrentSessionLoading: boolean;
  createSession: (bot?: TBot, redirect?: boolean) => Promise<TChatSession>;
  removeSession: (sessionId: string) => Promise<void>;
  clearChatSessions: () => Promise<void>;
  currentSession: TChatSession | undefined;
  stopGeneration: () => void;
  editor?: Editor | null;
  openPromptsBotCombo: boolean;
  setOpenPromptsBotCombo: (value: boolean) => void;
  refetchCurrentSession: () => Promise<void>;
  handleRunModel: (props: TRunModel, clear?: () => void) => void;
  removeMessage: (messageId: string) => void;
};
export const ChatContext = createContext<TChatContext | undefined>(undefined);
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
