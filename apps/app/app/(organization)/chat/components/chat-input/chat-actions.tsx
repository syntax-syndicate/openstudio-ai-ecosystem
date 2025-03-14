import { AudioRecorder } from '@/app/(organization)/chat/components/chat-input/audio-recorder';
import { ImageUpload } from '@/app/(organization)/chat/components/chat-input/image-upload';
import { useChatContext, usePromptsContext } from '@/context';
import { Telescope01Icon } from '@hugeicons-pro/core-stroke-rounded';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { ArrowUp, Book } from 'lucide-react';
import { CircleStop } from 'lucide-react';

export type TChatActions = {
  sendMessage: (message: string) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const ChatActions = ({
  sendMessage,
  handleImageUpload,
}: TChatActions) => {
  const { store, isReady } = useChatContext();
  const isGenerating = store((state) => state.isGenerating);
  const editor = store((state) => state.editor);
  const { open: openPrompts } = usePromptsContext();
  const stopGeneration = store((state) => state.stopGeneration);
  const abortController = store((state) => state.abortController);
  const hasTextInput = !!editor?.getText();

  const handleStopGeneration = () => {
    stopGeneration();
  };
  return (
    <Flex
      className="w-full px-1 pt-1 pb-1 md:px-2 md:pb-2"
      items="center"
      justify="between"
    >
      <Flex gap="xs" items="center">
        <AudioRecorder sendMessage={sendMessage} />
        <ImageUpload
          id="image-upload"
          label="Upload Image"
          tooltip="Upload Image"
          showIcon
          handleImageUpload={handleImageUpload}
        />
        {/* <SpaceSelector /> */}
        <Tooltip content="Prompts">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              openPrompts();
            }}
          >
            <Book size={16} strokeWidth="2" />
          </Button>
        </Tooltip>
        <Tooltip content="WIP - Deep Research">
          <Button
            disabled
            className="rounded-full px-2 py-1.5 text-green-600 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
            size="icon-sm"
            variant="ghost"
          >
            <HugeiconsIcon icon={Telescope01Icon} size={16} strokeWidth={2} />{' '}
            Deep Research
          </Button>
        </Tooltip>
      </Flex>
      <Flex gap="xs" items="center">
        {isGenerating ? (
          <Button size="sm" variant="secondary" onClick={handleStopGeneration}>
            <CircleStop size={16} strokeWidth={2} /> Stop
          </Button>
        ) : (
          <Button
            size="sm"
            variant={hasTextInput ? 'default' : 'secondary'}
            disabled={!hasTextInput || isGenerating || !isReady}
            onClick={() => {
              editor?.getText() && sendMessage(editor?.getText());
            }}
          >
            <ArrowUp size={16} strokeWidth="2" /> Send
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
