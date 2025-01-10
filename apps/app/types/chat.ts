import type { useEditor } from '@tiptap/react';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { TChatMessage } from './messages';
import type { TChatSession } from './sessions';
import type { TToolResponse } from './tools';

export type TChatState = {
  session?: TChatSession;
  currentMessage?: TChatMessage;
  messages: TChatMessage[];
  setMessages: (messages: TChatMessage[]) => void;
  currentTools: TToolResponse[];
  isGenerating: boolean;
  editor?: ReturnType<typeof useEditor>;
  context?: string;
  setEditor: (editor: ReturnType<typeof useEditor>) => void;
  setContext: (context: string) => void;
  setSession: (session: TChatSession) => void;
  addMessage: (message: TChatMessage) => void;
  setCurrentMessage: (message?: TChatMessage) => void;
  updateCurrentMessage: (message: Partial<TChatMessage>) => void;
  addTool: (tool: TToolResponse) => void;
  setTools: (tools: TToolResponse[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  abortController?: AbortController;
  setAbortController: (abortController: AbortController) => void;
  stopGeneration: () => void;
  resetState: () => void;
};

export type TChatContext = {
  store: UseBoundStore<StoreApi<TChatState>>;
  refetch: () => void;
};

export type TChatProvider = {
  children: React.ReactNode;
  sessionId: string;
};
