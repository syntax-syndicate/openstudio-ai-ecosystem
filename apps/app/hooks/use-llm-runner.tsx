import { defaultPreferences } from '@/config';
import { useChatContext, usePreferenceContext } from '@/context';
import { useRootContext } from '@/context/root';
import { env } from '@/env';
import { injectPresetValues } from '@/helper/preset-prompt-values';
import { constructMessagePrompt, constructMessagePromptNew, constructPrompt } from '@/helper/promptUtil';
import { generateShortUUID } from '@/helper/utils';
import { saveAiUsage } from '@/lib/utils/ai-usage';
import { modelService } from '@/services/models';
import { getApiKey } from '@/services/preferences/client';
import { getMessages, getSessionById } from '@/services/sessions/client';
import type { TLLMRunConfig, TProvider } from '@/types';
import { openai, streamText, convertToCoreMessages, smoothStream } from '@repo/ai';
import {createProvider} from "@repo/ai/lib/provider"
import { toast } from '@repo/design-system/hooks/use-toast';
import moment from 'moment';
import { useAssistantUtils, useTools } from '.';
import { usePremium } from './use-premium';

const getErrorMessage = (error: string) => {
  if (error.includes('image_url') && error.includes('400')) {
    return 'This model does not support images';
  }
  if (error.includes('429')) {
    return 'Exceeded daily limit or API is running out of credits.';
  }
  return undefined;
};

export const useLLMRunner = () => {
  const { store, refetch } = useChatContext();
  const editor = store((state) => state.editor);
  const setIsGenerating = store((state) => state.setIsGenerating);
  const currentMessage = store((state) => state.currentMessage);
  const setCurrentMessage = store((state) => state.setCurrentMessage);
  const updateCurrentMessage = store((state) => state.updateCurrentMessage);
  const addTool = store((state) => state.addTool);
  const resetState = store((state) => state.resetState);
  const setAbortController = store((state) => state.setAbortController);
  const { getModelByKey } = useAssistantUtils();
  const { preferences } = usePreferenceContext();
  const { getAvailableTools } = useTools();
  const {
    setApiKeyModalProvider,
    setOpenApiKeyModal,
    setOpenMessageLimitModal,
  } = useRootContext();
  const { isPremium, premium, user, messagesCountPerMonth } = usePremium();

  const invokeModel = async (config: TLLMRunConfig) => {
    //to avoid duplication not refetch when regenerating
    if (!config?.messageId) {
      refetch();
    }
    resetState();

    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);
    const { sessionId, messageId, input, context, image, assistant } = config;
    const newMessageId = messageId || generateShortUUID();

    let messageLimitPerMonth = 0;
    if (!premium || !premium.tier) {
      messageLimitPerMonth = env.NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT;
    } else {
      messageLimitPerMonth =
        premium!.tier === 'LIFETIME'
          ? env.NEXT_PUBLIC_LIFETIME_USERS_MESSAGE_LIMIT
          : premium!.tier === 'PRO_MONTHLY' || premium!.tier === 'PRO_ANNUALLY'
            ? env.NEXT_PUBLIC_PRO_USERS_MESSAGE_LIMIT
            : env.NEXT_PUBLIC_FREE_USERS_MESSAGE_LIMIT;
    }

    if (messagesCountPerMonth! >= messageLimitPerMonth) {
      setIsGenerating(false);
      console.log('You have exceeded the message limit for this month');
      setOpenMessageLimitModal(true);
      return;
    }

    store.getState().updateAssistantResponse(config.assistant, '', false, true);

    const modelKey = assistant.baseModel;
    const session = await getSessionById(sessionId);
    if (!session) {
      setIsGenerating(false);
      toast({
        title: 'Error',
        description: 'Session not found',
        variant: 'destructive',
      });
      return;
    }

    const messages = await getMessages(sessionId);

    const allPreviousMessages =
      messages?.filter((m) => m.id !== messageId) || [];

    const messageLimit =
      preferences.messageLimit || defaultPreferences.messageLimit;

    const selectedModelKey = getModelByKey(
      modelKey,
      assistant.provider as TProvider
    );
    if (!selectedModelKey) {
      throw new Error('Model not found');
    }

    const apiKey = await getApiKey(selectedModelKey.provider);

    if (
      !apiKey?.key &&
      !['ollama', 'chathub'].includes(selectedModelKey?.provider) &&
      !isPremium
    ) {
      setIsGenerating(false);
      setApiKeyModalProvider(selectedModelKey?.provider);
      setOpenApiKeyModal(true);
      return;
    }

    editor?.commands.clearContent();
    setIsGenerating(true);
    setCurrentMessage({
      //@ts-ignore
      runConfig: config,
      id: newMessageId,
      parentId: sessionId,
      sessionId,
      rawHuman: input || null,
      stop: false,
      stopReason: null,
      rawAI: null,
      aiResponses: [],
      image: image || null,
      tools: [],
      relatedQuestions: [],
      createdAt: moment().toDate(),
      isLoading: true,
      errorMessage: null,
    });

    const prompt = await constructPrompt({
      context,
      image,
      memories: preferences.memories,
      hasMessages: allPreviousMessages.length > 0,
      systemPrompt:
        session.customAssistant?.systemPrompt ||
        injectPresetValues(assistant.systemPrompt),
    });

    const availableTools = getAvailableTools(selectedModelKey);

    const selectedModel = await modelService.createInstance({
      model: selectedModelKey,
      preferences,
      provider: selectedModelKey.provider,
      apiKey: apiKey?.key,
      isPremium: isPremium,
    });
    console.log(selectedModel);

    // let agentExecutor: AgentExecutor | undefined;

    // const modifiedModel = Object.create(Object.getPrototypeOf(selectedModel));
    // Object.assign(modifiedModel, selectedModel);

    // modifiedModel.bindTools = (tools: any[], options: any) => {
    //   return selectedModel?.bindTools?.(tools, {
    //     ...options,
    //     recursionLimit: 5,
    //     signal: currentAbortController?.signal,
    //   });
    // };

    // if (availableTools?.length) {
    //   const agentWithTool = await createToolCallingAgent({
    //     llm: modifiedModel as any,
    //     tools: availableTools,
    //     prompt: prompt as any,
    //     streamRunnable: true,
    //   });

    //   agentExecutor = new AgentExecutor({
    //     agent: agentWithTool as any,
    //     tools: availableTools,
    //     maxIterations: 5,
    //   });
    // }
    // const chainWithoutTools = prompt.pipe(
    //   selectedModel.bind({
    //     signal: currentAbortController?.signal,
    //   }) as any
    // );

    let streamedMessage = '';

    // const executor =
    //   availableTools?.length && agentExecutor
    //     ? agentExecutor
    //     : chainWithoutTools;

    const chatHistory = await constructMessagePrompt({
      messages: allPreviousMessages,
      limit: messageLimit,
    });
    console.log('messageLimit', messageLimit);
    const coreMessages = await constructMessagePromptNew({
      systemPrompt: session.customAssistant?.systemPrompt ||
        injectPresetValues(assistant.systemPrompt),
      input: input || '',
      messages: allPreviousMessages,
      limit: messageLimit,
      context: context || '',
    });

    try {
      // const stream: any = await executor.invoke(
      //   {
      //     chat_history: chatHistory || [],
      //     context,
      //     input,
      //   },
      //   {
      //     maxConcurrency: 1,
      //     recursionLimit: 3,
      //     callbacks: [
      //       {
      //         handleLLMStart: async () => {},
      //         handleToolStart(
      //           tool,
      //           input,
      //           runId,
      //           parentRunId,
      //           tags,
      //           metadata,
      //           name
      //         ) {
      //           name && addTool({ toolName: name, isLoading: true });
      //         },
      //         handleLLMNewToken: async (token: string) => {
      //           streamedMessage += token;
      //           store
      //             .getState()
      //             .updateAssistantResponse(
      //               config.assistant,
      //               streamedMessage,
      //               false,
      //               true
      //             );
      //           updateCurrentMessage({
      //             isLoading: true,
      //             rawAI: streamedMessage,
      //             stop: false,
      //             stopReason: undefined,
      //           });
      //         },
      //         handleChainEnd: async () => {},
      //         handleLLMError: async (err: Error) => {
      //           // Log this error
      //           if (!currentAbortController?.signal.aborted) {
      //             toast({
      //               title: 'Error',
      //               description: 'Something went wrong',
      //               variant: 'destructive',
      //             });
      //           }

      //           const hasError: Record<string, boolean> = {
      //             cancel: currentAbortController?.signal.aborted,
      //             rateLimit:
      //               err.message.includes('429') &&
      //               !err.message.includes('chathub'),
      //             unauthorized: err.message.includes('401'),
      //           };

      //           const stopReason = Object.keys(hasError).find(
      //             (value) => hasError[value]
      //           ) as TStopReason;

      //           store
      //             .getState()
      //             .updateAssistantResponse(
      //               config.assistant,
      //               streamedMessage,
      //               false,
      //               false
      //             );

      //           updateCurrentMessage({
      //             isLoading: false,
      //             rawHuman: input,
      //             rawAI: streamedMessage,
      //             stop: true,
      //             errorMessage: getErrorMessage(err.message),
      //             stopReason: stopReason as any,
      //           });
      //         },
      //       },
      //     ],
      //   }
      // );
      console.log(coreMessages);
      const result = streamText({
        model: selectedModel.languageModel(selectedModelKey.key),
        abortSignal: currentAbortController?.signal,
        messages: coreMessages,
        // experimental_transform: smoothStream({
        //     chunking: 'word',
        //     delayInMs: 5,
        // }),
        maxTokens: {...defaultPreferences, ...preferences}.maxTokens <= selectedModelKey.maxOutputTokens ? {...defaultPreferences, ...preferences}.maxTokens : selectedModelKey.maxOutputTokens,
        // topP: Number(topP),
        // maxRetries: 2,
        // ...props,
        onChunk({ chunk }) {
          console.log("I am in onChunk")
          if (chunk.type === 'text-delta') {
            console.log(chunk.textDelta);
            streamedMessage += chunk.textDelta;
            store
              .getState()
              .updateAssistantResponse(
                config.assistant,
                streamedMessage,
                false,
                true
              );
            updateCurrentMessage({
              isLoading: true,
              rawAI: streamedMessage,
              stop: false,
              stopReason: undefined,
            });
          }
        },
        async onFinish({ text, finishReason, usage, response }) {
          console.log(text, finishReason, usage, response);
          console.log("I am in onFinish")
          store
            .getState()
            .updateAssistantResponse(config.assistant, text, true, false);

          updateCurrentMessage({
            rawHuman: input,
            rawAI: text,
            isLoading: false,
            image,
            stop: true,
            stopReason: 'finish',
          });

          await saveAiUsage({
            email: user!.email!,
            userId: user!.id,
            organizationId: user!.user_metadata.organization_id,
            model: selectedModelKey,
            usage: {
              input_tokens: usage.promptTokens || 0,
              output_tokens: usage.completionTokens || 0,
              total_tokens: usage.totalTokens || 0,
            },
          });
        },
      });

      for await (const part of result.fullStream) {
        switch(part.type){
          case "text-delta": {
            streamedMessage += part.textDelta;
            store
              .getState()
              .updateAssistantResponse(
                    config.assistant,
                    streamedMessage,
                    false,
                    true
                  );
                updateCurrentMessage({
                  isLoading: true,
                  rawAI: streamedMessage,
                  stop: false,
                  stopReason: undefined,
                });
            break;
          }
        }
      }
      //     case "finish": {
      //       store
      //   .getState()
      //   .updateAssistantResponse(
      //     config.assistant,
      //     part,
      //     true,
      //     false
      //   );

      // updateCurrentMessage({
      //   rawHuman: input,
      //   rawAI: text,
      //   isLoading: false,
      //   image,
      //   stop: true,
      //   stopReason: 'finish',
      // });

      // await saveAiUsage({
      //   email: user!.email!,
      //   userId: user!.id,
      //   organizationId: user!.user_metadata.organization_id,
      //   model: selectedModelKey,
      //   usage: {
      //     input_tokens: usage.promptTokens || 0,
      //     output_tokens: usage.completionTokens || 0,
      //     total_tokens: usage.totalTokens || 0,
      //   },
      // });
      //     }
      //   }
      // }

      // const stream: any = await executor.invoke(
      //   {
      //     chat_history: chatHistory || [],
      //     context,
      //     input,
      //   },
      //   {
      //     maxConcurrency: 1,
      //     recursionLimit: 3,
      //     callbacks: [
      //       {
      //         handleLLMStart: async () => {},
      //         handleToolStart(
      //           tool,
      //           input,
      //           runId,
      //           parentRunId,
      //           tags,
      //           metadata,
      //           name
      //         ) {
      //           name && addTool({ toolName: name, isLoading: true });
      //         },
      //         handleLLMNewToken: async (token: string) => {
      //           streamedMessage += token;
      //           store
      //             .getState()
      //             .updateAssistantResponse(
      //               config.assistant,
      //               streamedMessage,
      //               false,
      //               true
      //             );
      //           updateCurrentMessage({
      //             isLoading: true,
      //             rawAI: streamedMessage,
      //             stop: false,
      //             stopReason: undefined,
      //           });
      //         },
      //         handleChainEnd: async () => {},
      //         handleLLMError: async (err: Error) => {
      //           // Log this error
      //           if (!currentAbortController?.signal.aborted) {
      //             toast({
      //               title: 'Error',
      //               description: 'Something went wrong',
      //               variant: 'destructive',
      //             });
      //           }

      //           const hasError: Record<string, boolean> = {
      //             cancel: currentAbortController?.signal.aborted,
      //             rateLimit:
      //               err.message.includes('429') &&
      //               !err.message.includes('chathub'),
      //             unauthorized: err.message.includes('401'),
      //           };

      //           const stopReason = Object.keys(hasError).find(
      //             (value) => hasError[value]
      //           ) as TStopReason;

      //           store
      //             .getState()
      //             .updateAssistantResponse(
      //               config.assistant,
      //               streamedMessage,
      //               false,
      //               false
      //             );

      //           updateCurrentMessage({
      //             isLoading: false,
      //             rawHuman: input,
      //             rawAI: streamedMessage,
      //             stop: true,
      //             errorMessage: getErrorMessage(err.message),
      //             stopReason: stopReason as any,
      //           });
      //         },
      //       },
      //     ],
      //   }
      // );

      // store
      //   .getState()
      //   .updateAssistantResponse(
      //     config.assistant,
      //     stream?.content || stream?.output?.[0]?.text || stream?.output,
      //     true,
      //     false
      //   );

      // updateCurrentMessage({
      //   rawHuman: input,
      //   rawAI: stream?.content || stream?.output?.[0]?.text || stream?.output,
      //   isLoading: false,
      //   image,
      //   stop: true,
      //   stopReason: 'finish',
      // });

      // await saveAiUsage({
      //   email: user!.email!,
      //   userId: user!.id,
      //   organizationId: user!.user_metadata.organization_id,
      //   model: selectedModelKey,
      //   usage: {
      //     input_tokens: stream?.usage_metadata?.input_tokens || 0,
      //     output_tokens: stream?.usage_metadata?.output_tokens || 0,
      //     total_tokens: stream?.usage_metadata?.total_tokens || 0,
      //   },
      // });
//       for await (const textPart of result.textStream) {
//   console.log(textPart);
// }
      console.log(result.fullStream)
      console.log(result.toDataStreamResponse());
    } catch (err) {
      updateCurrentMessage({
        isLoading: false,
        stop: true,
      });
      console.error(err);
    }
  };

  return {
    invokeModel,
  };
};
