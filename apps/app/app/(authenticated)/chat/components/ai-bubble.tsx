import type { TRenderMessageProps } from '@/app/(authenticated)/chat/components/chat-messages';
import { useChatContext } from '@/app/context/chat/context';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import { useClipboard } from '@/app/hooks/use-clipboard';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { useModelList } from '@/app/hooks/use-model-list';
import {
  ArrowClockwise,
  Check,
  Copy,
  Info,
  TrashSimple,
} from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { encodingForModel } from 'js-tiktoken';
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

  const getTokenCount = (
    message: Partial<Pick<TChatMessage, 'model' | 'rawAI'>>
  ) => {
    const enc = encodingForModel('gpt-3.5-turbo');
    if (message.rawAI) {
      return enc.encode(message.rawAI).length;
    }
    return undefined;
  };

  const tokenCount = getTokenCount({ model, rawAI: aiMessage });

  return (
    <div className="mt-6 flex w-full flex-row gap-2">
      <div className="p-3">{modelForMessage?.icon()}</div>
      <div
        ref={messageRef}
        className=" flex w-full flex-col items-start rounded-2xl"
      >
        {aiMessage && (
          <div className="w-full pb-2">
            {renderMarkdown(aiMessage, id === 'streaming')}
          </div>
        )}
        <div className="flex w-full flex-row items-center justify-between py-3 opacity-50 transition-opacity hover:opacity-100">
          {loading && <Spinner />}
          {!loading && (
            <div className="flex flex-row gap-1">
              <Tooltip content="Copy">
                <Button
                  variant="ghost"
                  size="iconSm"
                  rounded="lg"
                  onClick={handleCopyContent}
                >
                  {showCopied ? (
                    <Check size={16} weight="bold" />
                  ) : (
                    <Copy size={16} weight="bold" />
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="Regenerate">
                <Button variant="ghost" size="iconSm" rounded="lg">
                  <ArrowClockwise size={16} weight="bold" />
                </Button>
              </Tooltip>
              <Tooltip content="Delete">
                <Button
                  variant="ghost"
                  size="iconSm"
                  rounded="lg"
                  onClick={() => {
                    removeMessage(id);
                  }}
                >
                  <TrashSimple size={16} weight="bold" />
                </Button>
              </Tooltip>
            </div>
          )}
          {tokenCount && !loading && (
            <div className="flex flex-row items-center gap-2 text-xs text-zinc-500">
              {modelForMessage?.name}
              <Tooltip content="Estimated Output Tokens">
                <span className="flex cursor-pointer flex-row items-center gap-1 p-2 text-xs">
                  {`${tokenCount} tokens`}
                  <Info size={14} weight="bold" />
                </span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
