import { AudioWaveSpinner } from '@/app/(authenticated)/chat/components/audio-wave';
import { usePreferenceContext } from '@/app/context/preferences/provider';
import { useSettings } from '@/app/context/settings/context';
import { blobToBase64 } from '@/app/lib/record';
import { Microphone, StopCircle } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { useToast } from '@repo/design-system/components/ui/use-toast';
import { OpenAI, toFile } from 'openai';
import { useRef, useState } from 'react';

export const useRecordVoice = () => {
  const [text, setText] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const { toast } = useToast();
  const { apiKeys } = usePreferenceContext();
  const [recording, setRecording] = useState<boolean>(false);
  const [transcribing, setIsTranscribing] = useState<boolean>(false);
  const { preferences } = usePreferenceContext();
  const { open: openSettings } = useSettings();
  const chunks = useRef<Blob[]>([]);

  const startRecording = async (): Promise<void> => {
    setText('');
    chunks.current = [];
    if (mediaRecorder) {
      mediaRecorder.start(1000);
      setRecording(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);
      newMediaRecorder.ondataavailable = (event) => {
        chunks.current.push(event.data);
      };
      newMediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/wav' });
        blobToBase64(audioBlob, getText);
      };
      setMediaRecorder(newMediaRecorder);
      newMediaRecorder.start(1000);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing the microphone: ', error);
      toast({
        title: 'Error',
        description: 'Failed to access the microphone.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getText = async (base64data: string): Promise<void> => {
    setIsTranscribing(true);
    try {
      const apiKey = apiKeys.openai;
      if (!apiKey) throw new Error('API key not found');
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });
      const audioBuffer = Buffer.from(base64data, 'base64');
      const transcription = await openai.audio.transcriptions.create({
        file: await toFile(audioBuffer, 'audio.wav', { type: 'audio/wav' }),
        model: 'whisper-1',
      });
      setText(transcription?.text || '');
    } catch (error) {
      console.error('Error transcribing audio: ', error);
      toast({
        title: 'Transcription Error',
        description: 'Failed to transcribe the audio.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const startVoiceRecording = async () => {
    const openAIAPIKeys = apiKeys.openai;
    if (!openAIAPIKeys) {
      toast({
        title: 'API key missing',
        description:
          'Recordings require OpenAI API key. Please check settings.',
        variant: 'destructive',
      });
      openSettings('openai');
      return;
    }

    if (preferences?.whisperSpeechToTextEnabled) {
      startRecording();
    } else {
      toast({
        title: 'Enable Speech to Text',
        description:
          'Recordings require Speech to Text enabled. Please check settings.',
        variant: 'destructive',
      });
      openSettings('voice-input');
    }
  };

  const renderRecordingControls = () => {
    if (recording) {
      return (
        <>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => {
              stopRecording();
            }}
          >
            <StopCircle size={20} weight="fill" className="text-red-300" />
          </Button>
        </>
      );
    }

    return (
      <Tooltip content="Record">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 min-w-8"
          onClick={startVoiceRecording}
        >
          <Microphone size={20} weight="bold" />
        </Button>
      </Tooltip>
    );
  };

  const renderListeningIndicator = () => {
    if (transcribing) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-4 py-1 text-sm text-white md:text-base dark:bg-zinc-900">
          <AudioWaveSpinner /> <p>Transcribing ...</p>
        </div>
      );
    }
    if (recording) {
      return (
        <div className="flex h-10 flex-row items-center gap-2 rounded-full bg-zinc-800 px-2 py-1 pr-4 text-sm text-white md:text-base dark:bg-zinc-900">
          <AudioWaveSpinner />
          <p>Listening ...</p>
        </div>
      );
    }
  };

  return {
    recording,
    startRecording,
    stopRecording,
    transcribing,
    text,
    renderRecordingControls,
    renderListeningIndicator,
    startVoiceRecording,
  };
};
