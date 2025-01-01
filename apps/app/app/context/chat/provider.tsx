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
  const { getSessions, createNewSession, getSessionById } = useChatSession();
  const [sessions, setSessions] = useState<TChatSession[]>([]);
  const [error, setError] = useState<string | undefined>();

  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const [lastStream, setLastStream] = useState<TStreamProps>();
  const { runModel } = useLLM({
    onStreamStart: () => {
      setError(undefined);
      setLastStream(undefined);
    },
    onStream: async (props) => {
      setLastStream(props);
    },
    onStreamEnd: () => {
      fetchSessions().then(() => {
        setLastStream(undefined);
      });
    },
    onError: (error) => {
      setError(error);
    },
  });

  const fetchSession = async () => {
    if (!sessionId) {
      return;
    }
    getSessionById(sessionId!.toString()).then((session) => {
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
    setIsSessionLoading(true);
    fetchSessions();
  }, []);
  const refetchSessions = () => {
    fetchSessions();
  };

  useEffect(() => {
    if (!lastStream) {
      fetchSession();
    }
  }, [lastStream]);

  return (
    <ChatContext.Provider
      value={{
        chatSession: [],
        sessions,
        refetchSessions,
        isSessionLoading,
        createSession,
        runModel,
        lastStream,
        error,
        currentSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
