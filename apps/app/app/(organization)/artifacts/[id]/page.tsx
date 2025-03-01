import { Chat } from '@/app/(organization)/artifacts/components/v2/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/model';
import { getChatById, getMessagesByChatId } from '@/lib/queries';
import { convertToUIMessages } from '@/lib/utils';
import { currentUser } from '@repo/backend/auth/utils';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function ChatSessionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  const chat = await getChatById({ id });

  if (!chat) return notFound();

  const user = await currentUser();

  if (!user) return notFound();

  const messagesFromDb = await getMessagesByChatId({ id });

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  return (
    <Chat
      id={id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
    />
  );
}
