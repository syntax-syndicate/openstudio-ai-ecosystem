import { useChatContext } from '@/app/context/chat/context';
import {
  type TChatSession,
  useChatSession,
} from '@/app/hooks/use-chat-session';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ChatMessages = () => {
  const { sessionId } = useParams();
  const { lastStream } = useChatContext();
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const { getSessionById } = useChatSession();
  const fetchSession = async () => {
    getSessionById(sessionId!.toString()).then((session) => {
      console.log('session', session);
      setCurrentSession(session);
    });
  };
  useEffect(() => {
    if (!sessionId) {
      return;
    }
    fetchSession();
  }, [sessionId]);
  useEffect(() => {
    if (!lastStream) {
      fetchSession();
    }
  }, [lastStream]);
  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === sessionId;
  return (
    <div className="flex flex-col">
      {currentSession?.messages.map((message) => (
        <div className="p-2">
          {message.rawHuman}
          {message.rawAI}
        </div>
      ))}
      {isLastStreamBelongsToCurrentSession && (
        <div className="p-2">
          {lastStream?.props?.query}
          {lastStream?.message}
        </div>
      )}
    </div>
  );
};
