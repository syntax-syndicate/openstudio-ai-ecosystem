import { sortMessages } from '@/helper/utils';
import type { TChatMessage } from '@/types';
import type { TConstructPrompt } from '@/types/prompts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import {
  type BaseMessagePromptTemplateLike,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import type { CoreMessage } from '@repo/ai';

const constructPrompt = async (props: TConstructPrompt) => {
  const { context, image, hasMessages, memories, systemPrompt } = props;
  const messagePlaceholders = new MessagesPlaceholder('chat_history');
  const memoryPrompt =
    memories?.length > 0 ? `Things to remember:\n${memories.join('\n')}` : '';
  const messagesPrompt = hasMessages
    ? `You can also refer to these previous conversations`
    : ``;

  const formatInstructions = props.formatInstructions
    ? `\n{format_instructions}`
    : ``;
  const systemMessage: BaseMessagePromptTemplateLike = [
    'system',
    `${systemPrompt}\n${memoryPrompt}\n${messagesPrompt}\n${formatInstructions}`,
  ];
  const userContent = `{input}\n\n${
    context
      ? `Answer user's question based on the following context: """{context}"""`
      : ``
  }`;
  const userMessageContent = image
    ? [
        {
          type: 'text',
          text: userContent,
        },
        {
          type: 'image_url',
          image_url: image,
        },
      ]
    : userContent;

  const userMessage: BaseMessagePromptTemplateLike = [
    'user',
    userMessageContent,
  ];
  return ChatPromptTemplate.fromMessages([
    systemMessage,
    messagePlaceholders,
    userMessage,
    ['placeholder', '{agent_scratchpad}'],
  ]);
};
const constructMessagePrompt = async ({
  messages,
  limit,
}: {
  messages: TChatMessage[];
  limit: number;
}) => {
  const sortedMessages = sortMessages(messages, 'createdAt');
  const chatHistory = sortedMessages
    .slice(-limit)
    .reduce((acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman, image }) => {
      if (rawHuman) {
        acc.push(
          new HumanMessage({
            content: image
              ? [
                  {
                    type: 'text',
                    text: rawHuman,
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: image,
                    },
                  },
                ]
              : rawHuman,
          })
        );
      }
      if (rawAI) {
        acc.push(new AIMessage(rawAI));
      }
      return acc;
    }, []);
  return chatHistory;
};
const constructMessagePromptNew = async ({
  messages,
  limit,
  systemPrompt,
  input,
  context,
}: {
  messages: TChatMessage[];
  limit: number;
  systemPrompt: string;
  input: string;
  context: string;
}): Promise<CoreMessage[]> => {
  const sortedMessages = sortMessages(messages, 'createdAt');
  const messageHistory = sortedMessages
    .slice(-limit)
    .map(({ rawAI, rawHuman, image }) => {
      if (rawHuman) {
        return {
          role: 'user',
          content: image
            ? [
                { type: 'text', text: rawHuman },
                { type: 'image', image },
              ]
            : rawHuman,
        };
      }
      return { role: 'assistant', content: rawAI || '' };
    })
    .filter(Boolean) as CoreMessage[];

  const userContent = `${input}\n\n${
    context
      ? `Answer user's question based on the following context: """${context}"""`
      : ``
  }`;

  return [
    { role: 'system', content: systemPrompt },
    ...messageHistory,
    { role: 'user', content: userContent },
  ];
};

export const constructPromptNew = (props: TConstructPrompt) => {
  const { context, image, hasMessages, memories, systemPrompt, userPrompt } =
    props;

  // Build memory section
  const memoryPrompt =
    memories?.length > 0
      ? `Things to remember:\n${memories.join('\n')}\n\n`
      : '';

  // Build messages section
  const messagesPrompt = hasMessages
    ? `You can also refer to these previous conversations\n\n`
    : '';

  // Build format instructions
  const formatInstructions = props.formatInstructions
    ? `\n{format_instructions}\n\n`
    : '';

  // Build system message
  const systemSection = `${systemPrompt}\n${memoryPrompt}${messagesPrompt}${formatInstructions}`;

  // Build user content
  const contextSection = context
    ? `Answer user's question based on the following context: """\n${context}\n"""\n\n`
    : '';

  const userSection = `${userPrompt}\n${contextSection}`;

  // Combine all sections
  const fullPrompt = `${systemSection}\n\n${userSection}`;

  // If there's an image, return an array of message objects
  // if (image) {
  //   return [
  //     { type: 'text', text: fullPrompt },
  //     { type: 'image', image }
  //   ];
  // }

  // Otherwise return the text prompt
  return fullPrompt;
};

export { constructMessagePrompt, constructPrompt, constructMessagePromptNew };
