import { useChatContext } from '@/context';
import { formatTickerTime } from '@/helper/utils';
import { useRecordVoice } from '@/hooks';
import { RecordIcon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui';
import { AudioVisualizer } from '@repo/design-system/components/ui/audio-visualizer';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { Flex } from '@repo/design-system/components/ui/flex';
import { LinearSpinner } from '@repo/design-system/components/ui/loading-spinner';
import { Type } from '@repo/design-system/components/ui/text';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { Check, X } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';

export type TAudioRecorder = {
  sendMessage: (message: string) => void;
};
export const AudioRecorder: FC<TAudioRecorder> = ({ sendMessage }) => {
  const { store } = useChatContext();
  const session = store((state) => state.session);
  const editor = store((state) => state.editor);
  const {
    stream,
    elapsedTime,
    stopRecording,
    recording,
    transcribing,
    text,
    cancelRecording,
    startVoiceRecording,
  } = useRecordVoice();

  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  useEffect(() => {
    if (text && session) {
      editor?.commands.clearContent();
      editor?.commands.setContent(text);
      sendMessage(text);
    }
  }, [text]);
  useEffect(() => {
    if (transcribing) {
      editor?.setEditable(false);
    } else {
      editor?.setEditable(true);
    }
  }, [transcribing]);
  return (
    <Flex>
      <Tooltip content="Record">
        <Button
          size="iconSm"
          variant="ghost"
          onClick={() => {
            startVoiceRecording();
          }}
        >
          <RecordIcon size={16} variant="stroke" strokeWidth="2" />
        </Button>
      </Tooltip>
      {transcribing && (
        <Flex
          items="center"
          justify="center"
          gap="sm"
          className="absolute inset-0 z-[50] h-full w-full bg-white/50 backdrop-blur-sm dark:bg-zinc-800/50"
        >
          <LinearSpinner /> <Type textColor="secondary">Transcribing ...</Type>
        </Flex>
      )}
      <Dialog
        open={recording}
        onOpenChange={() => {
          cancelRecording();
        }}
      >
        <DialogContent ariaTitle="Record Voice" className="!max-w-[400px]">
          <Flex direction="col" items="center" justify="center">
            <Flex items="center" direction="col" gap="sm" justify="between">
              <Flex direction="row" gap="sm" items="center" className="p-6">
                <Flex
                  gap="xs"
                  items="center"
                  className="rounded-full bg-zinc-100 px-4 py-2 dark:bg-zinc-700"
                >
                  <Type size="base" weight="medium" className="flex-shrink-0">
                    {formatTickerTime(elapsedTime)}
                  </Type>
                  <Type
                    textColor="tertiary"
                    size="base"
                    weight="medium"
                    className="flex-shrink-0"
                  >
                    / 1:00
                  </Type>
                </Flex>
              </Flex>

              <AudioVisualizer stream={stream} />

              <Flex gap="sm" className="w-full p-6" justify="center">
                <Button
                  variant="secondary"
                  rounded="full"
                  size="lg"
                  onClick={() => {
                    cancelRecording();
                  }}
                  className="group"
                >
                  <X size={16} strokeWidth="2" />
                  Cancel
                </Button>
                <Button
                  rounded="full"
                  size="lg"
                  onClick={() => {
                    stopRecording();
                  }}
                  className="group"
                >
                  <Check size={16} strokeWidth="2" />
                  Done
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </DialogContent>
      </Dialog>
    </Flex>
  );
};
