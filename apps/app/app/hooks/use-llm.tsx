import {
  type PromptProps,
  type TChatMessage,
  useChatSession,
} from '@/app/hooks/use-chat-session';
import { type TModelKey, useModelList } from '@/app/hooks/use-model-list';
import { usePreferences } from '@/app/hooks/use-preferences';
import { getInstruction, getRole } from '@/app/lib/prompts';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { v4 } from 'uuid';

export type TStreamProps = {
  props: PromptProps;
  model: TModelKey;
  sessionId: string;
  message?: string;
  loading?: boolean;
  error?: string;
};
export type TUseLLM = {
  onInit: (props: TStreamProps) => Promise<void>;
  onStreamStart: (props: TStreamProps) => Promise<void>;
  onStream: (props: TStreamProps) => Promise<void>;
  onStreamEnd: (props: TStreamProps) => Promise<void>;
  onError: (props: TStreamProps) => Promise<void>;
};

export const useLLM = ({
  onInit,
  onStreamStart,
  onStream,
  onStreamEnd,
  onError,
}: TUseLLM) => {
  const { getSessionById, addMessageToSession } = useChatSession();
  const { getApiKey, getPreferences } = usePreferences();
  const { createInstance, getModelByKey } = useModelList();

  const preparePrompt = async (props: PromptProps, history: TChatMessage[]) => {
    const messageHistory = history;
    const prompt = ChatPromptTemplate.fromMessages(
      messageHistory?.length > 0
        ? [
            [
              'system',
              "You are {role} Answer user's question based on the following context:",
            ],
            new MessagesPlaceholder('chat_history'),
            ['user', '{input}'],
          ]
        : [
            props?.context
              ? [
                  'system',
                  "You are {role}.  Answer user's question based on the following context: {context}",
                ]
              : ['system', 'You are {role}. {type}'],
            ['user', '{input}'],
          ]
    );
    const previousMessageHistory = messageHistory.reduce(
      (acc: (HumanMessage | AIMessage)[], { rawAI, rawHuman }) => {
        acc.push(new HumanMessage(rawHuman));
        acc.push(new AIMessage(rawAI));
        return acc;
      },
      []
    );
    return await prompt.formatMessages(
      messageHistory?.length > 0
        ? {
            role: getRole(props.role),
            chat_history: previousMessageHistory,
            input: props.query,
          }
        : {
            role: getRole(props.role),
            type: getInstruction(props.type),
            context: props.context,
            input: props.query,
          }
    );
  };
  const runModel = async (props: PromptProps, sessionId: string) => {
    const currentSession = await getSessionById(sessionId);
    if (!props?.query) {
      return;
    }
    const preferences = await getPreferences();
    const modelKey = preferences.defaultModel;
    onInit({ props, model: modelKey, sessionId, loading: true });

    const selectedModel = getModelByKey(modelKey);
    if (!selectedModel) {
      throw new Error('Model not found');
    }
    const apiKey = await getApiKey(selectedModel.baseModel);

    if (!apiKey) {
      onError({
        props,
        model: modelKey,
        sessionId,
        error: 'API Key not found',
        loading: false,
      });
      return;
    }

    try {
      const newMessageId = v4();
      const model = await createInstance(selectedModel, apiKey);
      const formattedChatPrompt = await preparePrompt(
        props,
        currentSession?.messages || []
      );
      const stream = await model.stream(formattedChatPrompt, {
        options: {
          stream: true,
        },
      });

      if (!stream) {
        return;
      }
      let streamedMessage = '';
      onStreamStart({
        props,
        message: streamedMessage,
        model: modelKey,
        sessionId,
        loading: true,
      });
      for await (const chunk of stream) {
        streamedMessage += chunk.content;
        console.log(streamedMessage);
        onStream({
          props,
          sessionId,
          message: streamedMessage,
          model: modelKey,
          loading: true,
        });
      }
      const chatMessage = {
        id: newMessageId,
        model: selectedModel.key,
        human: new HumanMessage(props.query),
        ai: new AIMessage(streamedMessage),
        rawHuman: props.query,
        rawAI: streamedMessage,
        props,
      };
      addMessageToSession(sessionId, chatMessage).then(() => {
        onStreamEnd({
          props,
          model: modelKey,
          sessionId,
          loading: false,
          message: streamedMessage,
        });
      });
    } catch (e: any) {
      console.log(typeof e, e?.error?.message);
      console.log(typeof e, e?.error);

      onError({
        props,
        model: modelKey,
        sessionId,
        error: e?.error?.message || e?.error?.error?.message,
        loading: false,
      });
    }
  };
  return {
    runModel,
  };
};
