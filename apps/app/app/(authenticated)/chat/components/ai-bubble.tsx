import { useClipboard } from '@/app/hooks/use-clipboard';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { useModelList } from '@/app/hooks/use-model-list';
import {
  ArrowClockwise,
  BookmarkSimple,
  Check,
  Copy,
  TrashSimple,
} from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import type { TRenderMessageProps } from './chat-messages';

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { key, humanMessage, aiMessage, loading, model } = props;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();
  const modelForMessage = getModelByKey(model);
  const handleCopyContent = () => {
    messageRef?.current && aiMessage && copy(aiMessage);
  };

  return (
    <motion.div
      ref={messageRef}
      className="flex w-full flex-col items-start rounded-2xl border border-white/5 bg-white/5 px-4 pt-4 pb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: 'easeInOut' },
      }}
    >
      {aiMessage && renderMarkdown(aiMessage, key === 'streaming')}
      {loading && <Spinner />}
      <div className="flex w-full flex-row items-center justify-between py-1 opacity-50 transition-opacity hover:opacity-100">
        <motion.p
          className="flex flex-row items-center gap-2 py-1/2 text-xs text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1, ease: 'easeInOut' },
          }}
        >
          {modelForMessage?.icon()}
          {modelForMessage?.name}
        </motion.p>
        <div className="flex flex-row gap-1">
          <Button variant="ghost" size="iconSm" rounded="lg">
            <BookmarkSimple size={16} weight="regular" />
          </Button>
          <Button
            variant="ghost"
            size="iconSm"
            rounded="lg"
            onClick={handleCopyContent}
          >
            {showCopied ? (
              <Check size={16} weight="regular" />
            ) : (
              <Copy size={16} weight="regular" />
            )}
          </Button>
          <Button variant="ghost" size="iconSm" rounded="lg">
            <ArrowClockwise size={16} weight="regular" />
          </Button>
          <Button variant="ghost" size="iconSm" rounded="lg">
            <TrashSimple size={16} weight="regular" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
