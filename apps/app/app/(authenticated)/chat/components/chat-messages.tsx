import { useChatContext } from '@/app/context/chat/context';
import {
  type TChatSession,
  useChatSession,
} from '@/app/hooks/use-chat-session';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const ChatMessages = () => {
  const { sessionId } = useParams();
  const { renderMarkdown } = useMarkdown();

  const { lastStream } = useChatContext();
  const [currentSession, setCurrentSession] = useState<
    TChatSession | undefined
  >();
  const chatContainer = useRef<HTMLDivElement>(null);
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
    scrollToBottom();
  }, [currentSession]);
  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (lastStream) {
      scrollToBottom();
    } else {
      fetchSession();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession =
    lastStream?.sessionId === sessionId;
  return (
    <div
      className="flex h-screen w-full flex-col items-center overflow-y-auto pb-[200px]"
      ref={chatContainer}
    >
      <div className="flex max-w-[500px] flex-col gap-4">
        {currentSession?.messages.map((message) => (
          <div className="p-2" key={message.id}>
            {message.rawHuman}
            {renderMarkdown(message.rawAI)}
          </div>
        ))}
        {isLastStreamBelongsToCurrentSession && (
          <div className="p-2">
            {lastStream?.props?.query}
            {renderMarkdown(lastStream?.message ?? '')}
          </div>
        )}
      </div>
    </div>
  );
};
