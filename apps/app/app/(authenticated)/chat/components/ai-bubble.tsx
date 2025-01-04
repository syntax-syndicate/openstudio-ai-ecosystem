import { RegenerateWithModelSelect } from '@/app/(authenticated)/chat/components/regenerate-model-select';
import { useChatContext } from '@/app/context/chat/context';
import { useSettings } from '@/app/context/settings/context';
import type { TChatMessage } from '@/app/hooks/use-chat-session';
import { useClipboard } from '@/app/hooks/use-clipboard';
import { useMarkdown } from '@/app/hooks/use-mdx';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { useTokenCounter } from '@/app/hooks/use-token-counter';
import { Check, Copy, TrashSimple } from '@phosphor-icons/react';
import {
  Alert,
  AlertDescription,
} from '@repo/design-system/components/ui/alert';
import { Button } from '@repo/design-system/components/ui/button';
import Spinner from '@repo/design-system/components/ui/loading-spinner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/design-system/components/ui/popover';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useRef, useState } from 'react';

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
  const { getTokenCount } = useTokenCounter();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const handleCopyContent = () => {
    messageRef?.current && rawAI && copy(rawAI);
  };
  const { removeMessage, runModel } = useChatContext();

  return (
    <div className="mt-6 flex w-full flex-col gap-2 md:flex-row">
      <div className="px-0 py-1 md:px-3">{modelForMessage?.icon()}</div>
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
        <div className="flex w-full flex-row items-center justify-between py-3 opacity-70 transition-opacity hover:opacity-100">
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
                <Popover
                  open={openDeleteConfirm}
                  onOpenChange={setOpenDeleteConfirm}
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="iconSm" rounded="lg">
                      <TrashSimple size={16} weight="bold" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="pb-2 font-medium text-sm md:text-base">
                      Are you sure you want to delete this message?
                    </p>
                    <div className="flex flex-row gap-1">
                      <Button
                        variant="default"
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          removeMessage(id);
                        }}
                      >
                        Delete Message
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOpenDeleteConfirm(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </Tooltip>
            </div>
          )}
          {!isLoading && (
            <div className="flex flex-row items-center gap-2 text-sm md:text-base text-zinc-500">
              {modelForMessage?.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
