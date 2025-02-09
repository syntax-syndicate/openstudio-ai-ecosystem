import { ToolBadge } from '@/app/(organization)/chat/components/tools/tool-badge';
import { useChatContext, usePreferenceContext } from '@/context';
import { useRootContext } from '@/context/root';
import { slideUpVariant } from '@/helper/animations';
import { useAssistantUtils } from '@/hooks';
import { useLLMRunner } from '@/hooks/use-llm-runner';
import { usePremium } from '@/hooks/use-premium';
import type { TChatMessage } from '@/types';
import { ArrowRight02Icon, RepeatIcon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { StaggerContainer } from '@repo/design-system/components/ui/stagger-container';
import { Type } from '@repo/design-system/components/ui/text';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { FC } from 'react';

export type TAIRelatedQuestions = {
  message: TChatMessage;
  modelId?: string;
  show: boolean;
};

export const AIRelatedQuestions: FC<TAIRelatedQuestions> = ({
  message,
  show,
  modelId,
}) => {
  const { refetch, store } = useChatContext();
  const { setOpenPricingModal } = useRootContext();
  const { isPremium } = usePremium();
  const isGenerating = store((state) => state.isGenerating);
  const { preferences } = usePreferenceContext();
  const { getAssistantByKey } = useAssistantUtils();
  const { invokeModel } = useLLMRunner();

  // Filter to get specific AI response
  const targetResponse = useMemo(() => {
    if (!modelId) return message; // Fallback for single-assistant
    return message.aiResponses?.find((r) => r.assistant.key === modelId);
  }, [message, modelId]);

  // const handleOnClick = (question: string) => {
  //   const assistant = preferences.defaultAssistant;

  //   const props = getAssistantByKey(assistant);
  //   if (!props?.assistant) {
  //     return;
  //   }
  //   message.sessionId &&
  //     invokeModel({
  //       input: question,
  //       sessionId: message.sessionId,
  //       assistant: props.assistant,
  //     });
  // };

  // Get questions from filtered response
  // const hasQuestions = targetResponse?.relatedQuestions?.length > 0;

  const handleOnClick = (question: string) => {
    // Get all configured assistants
    const assistants = preferences.defaultAssistants
      ? preferences.defaultAssistants
          .map((key) => getAssistantByKey(key))
          .filter(Boolean)
      : [getAssistantByKey(preferences.defaultAssistant)].filter(Boolean);

    // if (!isPremium && assistants.length > 1) {
    //   toast({
    //     title: 'Error',
    //     description:
    //       'Upgrade to activate multi assistant mode or to continue select just one assistant',
    //     variant: 'destructive',
    //   });
    //   setOpenPricingModal(true);
    //   return;
    // }

    if (!assistants.length || !message.sessionId) return;

    // Invoke model for each assistant
    assistants.forEach((assistantProps) => {
      invokeModel({
        input: question,
        sessionId: message.sessionId!,
        assistant: assistantProps!.assistant,
      });
    });
  };

  if (
    !Array.isArray(message?.relatedQuestions) ||
    !message?.relatedQuestions?.length ||
    !show ||
    isGenerating
  ) {
    return null;
  }

  return (
    <StaggerContainer>
      <Flex
        direction="col"
        gap="sm"
        className="mt-4 w-full border-zinc-500/10 border-t pt-8"
      >
        <ToolBadge icon={RepeatIcon} text={'Related'} />
        {message?.relatedQuestions?.map((question) => {
          return (
            <motion.div key={question} variants={slideUpVariant}>
              <Type
                className="cursor-pointer items-center gap-2 py-0.5 decoration-zinc-500 underline-offset-4 opacity-70 hover:underline hover:opacity-100"
                size="sm"
                onClick={() => handleOnClick(question)}
                weight="medium"
              >
                <ArrowRight02Icon
                  size={18}
                  strokeWidth={2}
                  className="flex-shrink-0"
                />
                {question}
              </Type>
            </motion.div>
          );
        })}
      </Flex>
    </StaggerContainer>
  );
};
