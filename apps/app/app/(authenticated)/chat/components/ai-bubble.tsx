import { RegenerateWithModelSelect } from '@/app/(authenticated)/chat/components/regenerate-model-select';
import { useChatContext } from '@/app/context/chat/context';
import { useSettings } from '@/app/context/settings/context';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import { useClipboard } from '@/app/hooks/use-clipboard';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { Check, Copy, Info, TrashSimple } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { encodingForModel } from 'js-tiktoken';
import { useRef } from 'react';

export type TAIMessageBubble = {
  chatMessage: TChatMessage;
  isLast: boolean;
};

export const AIMessageBubble = ({ chatMessage, isLast }: TAIMessageBubble) => {
  const { id, rawAI, isLoading, model, errorMesssage } = chatMessage;
  const messageRef = useRef<HTMLDivElement>(null);
  const { showCopied, copy } = useClipboard();
  const { getModelByKey } = useModelList();
  const { renderMarkdown } = useMarkdown();
  const modelForMessage = getModelByKey(model);
  const { open: openSettings } = useSettings();
  const handleCopyContent = () => {
    messageRef?.current && rawAI && copy(rawAI);
  };
  const { removeMessage, runModel } = useChatContext();

  const getTokenCount = (
    message: Partial<Pick<TChatMessage, 'model' | 'rawAI'>>
  ) => {
    const enc = encodingForModel('gpt-3.5-turbo');
    if (message.rawAI) {
      return enc.encode(message.rawAI).length;
    }
    return undefined;
  };

  const tokenCount = getTokenCount({ model, rawAI });

  return (
    <div className="mt-6 flex w-full flex-row gap-2">
      <div className="p-3">{modelForMessage?.icon()}</div>
      <div
        ref={messageRef}
        className=" flex w-full flex-col items-start rounded-2xl"
      >
        {rawAI && (
          <div className="w-full pb-2">{renderMarkdown(rawAI, isLoading)}</div>
        )}
        {errorMesssage && (
          <Alert variant="destructive">
            <AlertDescription>
              Something went wrong. Make sure your API key is working.
              <Button
                variant="link"
                size="link"
                onClick={() => {
                  openSettings();
                }}
              >
                Check API Key
              </Button>{' '}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex w-full flex-row items-center justify-between py-3 opacity-50 transition-opacity hover:opacity-100">
          {isLoading && <Spinner />}
          {!isLoading && (
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
              {chatMessage && isLast && (
                <RegenerateWithModelSelect
                  onRegenerate={(model: TModelKey) => {
                    runModel({
                      messageId: chatMessage.id,
                      model: model,
                      props: chatMessage.props,
                      sessionId: chatMessage.sessionId,
                    });
                  }}
                />
              )}
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
          {tokenCount && !isLoading && (
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
