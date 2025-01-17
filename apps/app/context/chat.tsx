'use client';
import { useSessions } from '@/context/sessions';
import { createChatStore } from '@/store/chat/store';
import type { TChatContext, TChatProvider } from '@/types/chat';
import { FullPageLoader } from '@repo/design-system/components/ui/full-page-loader';
import { type FC, createContext, useContext, useEffect, useMemo } from 'react';

export const ChatContext = createContext<undefined | TChatContext>(undefined);

export const ChatProvider: FC<TChatProvider> = ({ children, sessionId }) => {
  const store = useMemo(() => createChatStore(), []); // Create a unique store for each provider
  const setSession = store((state) => state.setSession);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const setMessages = store((state) => state.setMessages);
  const { useGetSessionByIdQuery, useMessagesQuery, createSession } =
    useSessions();

  const currentSession = useGetSessionByIdQuery(sessionId as string);
  const messages = useMessagesQuery(sessionId as string);

  useEffect(() => {
    if (currentSession?.data) {
      setSession(currentSession?.data || []);
      setCurrentMessage(undefined);
    }
  }, [currentSession?.data]);

  useEffect(() => {
    if (sessionId && currentSession?.error) {
      setCurrentMessage(undefined);
      createSession();
    }
  }, [currentSession?.error, sessionId]);

  useEffect(() => {
    if (messages?.data) {
      setMessages(messages.data);
    }
  }, [messages?.data]);

  if (currentSession?.isLoading) {
    return <FullPageLoader />;
  }

  return (
    <ChatContext.Provider
      value={{
        store,
        refetch: () => {
          currentSession?.refetch();
          messages?.refetch();
          setCurrentMessage(undefined);
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
