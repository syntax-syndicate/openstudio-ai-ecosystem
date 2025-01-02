import type { TRenderMessageProps } from '@/app/(authenticated)/chat/components/chat-messages';
import { useChatContext } from '@/app/context/chat/context';
import { useClipboard } from '@/app/hooks/use-clipboard';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { useModelList } from '@/app/hooks/use-model-list';
import {
  ArrowClockwise,
  Check,
  Copy,
  TrashSimple,
} from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { useRef } from 'react';

export const AIMessageBubble = (props: TRenderMessageProps) => {
  const { id, humanMessage, aiMessage, loading, model } = props;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();
  const modelForMessage = getModelByKey(model);
  const handleCopyContent = () => {
    messageRef?.current && aiMessage && copy(aiMessage);
  };
  const { removeMessage } = useChatContext();

  return (
    <div
      ref={messageRef}
      className="flex w-full flex-col items-start rounded-2xl border border-white/5 bg-white/5 px-4"
    >
      {aiMessage && (
        <div className="pt-4 pb-2">
          {renderMarkdown(aiMessage, id === 'streaming')}
        </div>
      )}

      <div className="flex w-full flex-row items-center justify-between py-3 opacity-50 transition-opacity hover:opacity-100">
        <p className="flex flex-row items-center gap-2 py-1/2 text-xs text-zinc-500">
          {loading ? <Spinner /> : modelForMessage?.name}
        </p>
        {!loading && (
          <div className="flex flex-row gap-1">
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
            <Button
              variant="ghost"
              size="iconSm"
              rounded="lg"
              onClick={() => {
                removeMessage(id);
              }}
            >
              <TrashSimple size={16} weight="regular" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
