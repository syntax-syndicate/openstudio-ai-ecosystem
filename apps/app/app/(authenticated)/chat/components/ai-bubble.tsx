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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
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
        <p className="flex flex-row items-center gap-4 py-1/2 text-xs text-zinc-500">
          <span className="flex flex-row items-center gap-2">
            {' '}
            {modelForMessage?.icon()}
            {loading ? <Spinner /> : modelForMessage?.name}{' '}
          </span>
          {tokenCount && (
            <Tooltip>
              <TooltipTrigger>
                <span className="flex cursor-pointer flex-row items-center gap-1 p-2">
                  {`${getTokenCount({
                    model,
                    rawAI: aiMessage,
                  })} tokens`}
                  <Info size={14} weight="bold" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated Output Tokens</p>
              </TooltipContent>
            </Tooltip>
          )}
        </p>
        {!loading && (
          <div className="flex flex-row gap-1">
            <Tooltip>
              <TooltipTrigger>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="ghost" size="iconSm" rounded="lg">
                  <ArrowClockwise size={16} weight="regular" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};
