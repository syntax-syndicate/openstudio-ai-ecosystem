'use client';

import { ChatContext } from '@/app/context/chat/context';
import { useChatSession } from '@/app/hooks/use-chat-session';
import type { TChatSession } from '@/app/hooks/use-chat-session';
import { useLLM } from '@/app/hooks/use-llm';
import type { TStreamProps } from '@/app/hooks/use-llm';
import { useParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';

export type TChatProvider = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: TChatProvider) => {
  const { sessionId } = useParams();
  const {
    getSessions,
    createNewSession,
    getSessionById,
    clearSessions,
    removeSessionById,
  } = useChatSession();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const [streamingMessage, setStreamingMessage] = useState<TStreamProps>();
  const { runModel, stopGeneration } = useLLM({
    onInit: async (props) => {
      setStreamingMessage(props);
    },
    onStreamStart: async (props) => {
      setStreamingMessage(props);
    },
    onStream: async (props) => {
      setStreamingMessage(props);
    },
    onStreamEnd: async () => {
      fetchSessions().then(() => {
        setStreamingMessage(undefined);
      });
    },
    onError: async (error) => {
      setStreamingMessage(error);
    },
  });

  const fetchSession = async () => {
    if (!sessionId) {
      return;
    }
    getSessionById(sessionId?.toString()).then((session) => {
      setCurrentSession(session);
    });
  };
  useEffect(() => {
    if (!sessionId) {
      return;
    }
    fetchSession();
  }, [sessionId]);

  const fetchSessions = async () => {
    const sessions = await getSessions();
    setSessions(sessions);
    setIsSessionLoading(false);
  };
  const createSession = async () => {
    const newSession = await createNewSession();
    fetchSessions();
    return newSession;
  };

  useEffect(() => {
    if (!streamingMessage) {
      fetchSession();
    }
  }, [streamingMessage]);

  useEffect(() => {
    setIsSessionLoading(true);
    fetchSessions();
  }, []);
  const refetchSessions = () => {
    fetchSessions();
  };

  const clearChatSessions = async () => {
    clearSessions().then(() => {
      setSessions([]);
    });
  };

  const removeSession = async (sessionId: string) => {
    const sessions = await removeSessionById(sessionId);
    await fetchSessions();
  };

  return (
    <ChatContext.Provider
      value={{
        chatSession: [],
        sessions,
        refetchSessions,
        isSessionLoading,
        createSession,
        runModel,
        streamingMessage,
        currentSession,
        clearChatSessions,
        removeSession,
        stopGeneration,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
