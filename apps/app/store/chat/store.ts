import type { TAssistant } from '@/types/assistants';
import type { TChatState } from '@/types/chat';
import type { TAIResponse } from '@/types/messages';
import { create } from 'zustand';

const initialState = {
  session: undefined,
  messages: [],
  currentMessage: undefined,
  currentTools: [],
  context: undefined,
  editor: undefined,
  isGenerating: false,
  isInitialized: false,
  abortController: undefined,
};

export const createChatStore = () =>
  create<TChatState>((set, get) => ({
    ...initialState,
    setSession: (session) => set({ session }),
    setMessages: (messages) => {
      set({ messages });
      if (messages.length > 0) {
        set({ isInitialized: true });
      } else {
        set({ isInitialized: false });
      }
    },
    updateCurrentMessage: (message) => {
      const { currentMessage } = get();
      if (currentMessage) {
        // Handle multiple AI responses
        const newAiResponses = message.aiResponses
          ? [...(currentMessage.aiResponses || []), ...message.aiResponses]
          : currentMessage.aiResponses;

        set({
          currentMessage: {
            ...currentMessage,
            ...message,
            aiResponses: newAiResponses,
          },
        });
      }
    },
    // Add new action for parallel updates
    updateAssistantResponse: (
      assistant: TAssistant,
      content: string,
      isComplete: boolean,
      isLoading: boolean
    ) => {
      const { currentMessage } = get();
      if (!currentMessage) return;

      const existingResponseIndex = currentMessage.aiResponses?.findIndex(
        (response) => response.assistant.key === assistant.key
      );

      const baseResponse: TAIResponse = {
        assistant,
        rawAI: content,
        tools: [],
        relatedQuestions: [],
        stopReason: null,
        errorMessage: null,
        isLoading: isLoading,
        createdAt: new Date(),
        isComplete,
      };

      let updatedAiResponses = currentMessage.aiResponses || [];
      if (existingResponseIndex !== -1) {
        updatedAiResponses = updatedAiResponses.map((response, index) =>
          index === existingResponseIndex
            ? { ...response, rawAI: content, isLoading, isComplete }
            : response
        );
      } else {
        //@ts-ignore
        updatedAiResponses = [...updatedAiResponses, baseResponse];
      }

      set({
        currentMessage: {
          ...currentMessage,
          aiResponses: updatedAiResponses,
        },
      });
    },
    setIsInitialized: (isInitialized) => set({ isInitialized }),
    removeLastMessage: () => {
      const { messages } = get();
      const newMessages = messages.slice(0, -1);
      set({ messages: newMessages });
      if (newMessages.length === 0) {
        set({ isInitialized: false });
      }
    },
    setTools: (tools) => set({ currentTools: tools }),
    addTool: (tool) => {
      const { currentMessage } = get();
      if (!currentMessage?.id) return;
      const exisitingTool = currentMessage?.tools?.find(
        (t) => t.toolName === tool?.toolName
      );
      const updatedTools = exisitingTool
        ? currentMessage?.tools?.map((t) =>
            t.toolName === tool.toolName ? { ...t, ...tool } : t
          )
        : [...(currentMessage?.tools || []), tool];
      set({
        currentMessage: {
          ...currentMessage,
          tools: updatedTools || [],
        },
      });
    },
    setCurrentMessage: (message) => set({ currentMessage: message }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setEditor: (editor) => set({ editor }),
    resetState: () =>
      set({
        currentMessage: undefined,
        currentTools: [],
        isGenerating: false,
        context: undefined,
        abortController: undefined,
      }),
    setAbortController: (abortController) => set({ abortController }),
    stopGeneration: () => {
      const { abortController } = get();
      abortController?.abort('cancel');
    },
    addMessage: (message) => {
      const { messages } = get();
      const messageExists = messages.some((m) => m.id === message.id);
      const updatedMessages = messages.map((m) =>
        m.id === message.id ? { ...m, ...message } : m
      );
      set({
        messages: messageExists ? updatedMessages : [...messages, message],
      });
    },
    setContext: (context) => set({ context }),
  }));
