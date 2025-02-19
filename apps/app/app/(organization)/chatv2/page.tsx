import { Chat } from '@/app/(organization)/chatv2/components/v2/chat';
import { DataStreamHandler } from '@/app/(organization)/chatv2/components/v2/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/model';
import { generateUUID } from '@/lib/utils';

export default async function ChatPage() {
  const id = generateUUID();

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={DEFAULT_CHAT_MODEL}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
