import { useChatContext } from '@/app/context/chat/context';
import { useMarkdown } from '@/app/hooks/use-mdx';
import type { TModelKey } from '@/app/hooks/use-model-list';
import { Warning } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@repo/design-system/components/ui/alert';
import { Avatar } from '@repo/design-system/components/ui/custom-avatar';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export type TRenderMessageProps = {
  key: string;
  humanMessage: string;
  model: TModelKey;
  aiMessage?: string;
  loading?: boolean;
};

export const ChatMessages = () => {
  const { renderMarkdown } = useMarkdown();
  const { streamingMessage, currentSession } = useChatContext();
  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession]);

  const scrollToBottom = () => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (streamingMessage) {
      scrollToBottom();
    }
  }, [streamingMessage]);

  const isLastStreamBelongsToCurrentSession =
    streamingMessage?.sessionId === currentSession?.id;

  const renderMessage = (props: TRenderMessageProps) => {
    const { key, humanMessage, aiMessage, loading, model } = props;
    return (
      <div className="flex w-full flex-col items-start gap-1" key={key}>
        <motion.div
          className="flex flex-row gap-2 rounded-2xl border border-white/5 bg-black/30 p-2 pr-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: 'easeInOut' },
          }}
        >
          <Avatar name="Vineeth" />
          <span className="pt-1.5 leading-5">{humanMessage}</span>
        </motion.div>
        <motion.div
          className="flex w-full flex-col items-start rounded-2xl border border-white/5 bg-white/5 p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: 'easeInOut' },
          }}
        >
          {aiMessage && renderMarkdown(aiMessage, key === 'streaming')}
          {loading && <Spinner />}
        </motion.div>
        <motion.p
          className="px-2 py-1/2 text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: 'easeInOut' },
          }}
        >
          {model}
        </motion.p>
      </div>
    );
  };

  return (
    <div
      className="flex h-screen w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      ref={chatContainer}
    >
      <motion.div
        className="flex w-[600px] flex-col gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, ease: 'easeInOut' } }}
      >
        {currentSession?.messages.map((message) =>
          renderMessage({
            key: message.id,
            humanMessage: message.rawHuman,
            model: message.model,
            aiMessage: message.rawAI,
          })
        )}
        {isLastStreamBelongsToCurrentSession &&
          streamingMessage?.props?.query &&
          !streamingMessage?.error &&
          renderMessage({
            key: 'streaming',
            humanMessage: streamingMessage?.props?.query,
            aiMessage: streamingMessage?.message,
            model: streamingMessage?.model,
            loading: streamingMessage?.loading,
          })}
        {streamingMessage?.error && (
          <Alert variant="destructive">
            <Warning size={20} weight="bold" />
            <AlertTitle>Ahh! Something went wrong!</AlertTitle>
            <AlertDescription>{streamingMessage?.error}</AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
};
