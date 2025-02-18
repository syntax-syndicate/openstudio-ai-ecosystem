import { generateTitleFromUserMessage } from '@/lib/actions';
import { systemPrompt } from '@/lib/ai/prompts';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { deleteChatById, getChatById, saveChat, saveMessages } from '@/lib/queries';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';
import { sanitizeResponseMessages } from '@/lib/utils';
import {
  type Message,
  createDataStreamResponse,
  openai,
  smoothStream,
  streamText,
} from '@repo/ai';
import { currentUser } from '@repo/backend/auth/utils';
import type { TLLMRunConfig } from '@repo/backend/types';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
    runConfig,
  }: {
    id: string;
    messages: Array<Message>;
    selectedChatModel: string;
    runConfig: TLLMRunConfig;
  } = await request.json();

  const user = await currentUser();
  console.log('user', user);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage)
    return new Response('No user message found', { status: 400 });

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({
      id,
      userId: user.id,
      organizationId: user.user_metadata.organization_id,
      title,
    });
  }

  await saveMessages({
    messages: [
      { ...userMessage, createdAt: new Date(), chatId: id, runConfig },
    ],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      const result = streamText({
        //TODO: remove hardcoded model later
        model: openai('gpt-4o-mini'),
        system: systemPrompt({ selectedChatModel }),
        messages,
        experimental_activeTools: ['getWeather', 'createDocument', 'updateDocument', 'requestSuggestions'],
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
          createDocument: createDocument({ user, dataStream }),
          updateDocument: updateDocument({ user, dataStream }),
          requestSuggestions: requestSuggestions({ user, dataStream }),
        },
        onFinish: async ({ response, reasoning }) => {
          if (user.id) {
            try {
              console.log('response', response);
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              console.log('sanitizedResponseMessages', sanitizedResponseMessages);
              await saveMessages({
                messages: sanitizedResponseMessages.map((message) => {
                  return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                    runConfig,
                  };
                }),
              });
            } catch (error) {
              console.error('Failed to save chat');
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      });
      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return 'Oops, an error occured!';
    },
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
