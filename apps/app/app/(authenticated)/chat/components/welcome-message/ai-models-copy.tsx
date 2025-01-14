import {
  ModelIcon,
  type ModelIconType,
} from '@/app/(authenticated)/chat/components/model-icon';
import { slideUpVariant } from '@/helper/animations';
import { Flex } from '@repo/design-system/components/ui/flex';
import { StaggerContainer } from '@repo/design-system/components/ui/stagger-container';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { motion } from 'framer-motion';

export const AiModelsCopy = () => {
  const modelList = ['gpt4', 'anthropic', 'ollama', 'gemini', 'groq'];
  return (
    <>
      Unleash the power of multiple AI minds
      <div className="relative inline-block h-4 w-[160px]">
        <StaggerContainer>
          <Flex className="-translate-y-1 absolute top-0 left-0 mx-4">
            {modelList?.map((model, index) => {
              return (
                <Tooltip key={model} content={model}>
                  <motion.div
                    key={model}
                    variants={slideUpVariant}
                    className="mr-[-8px] w-full rounded-md"
                    initial={{
                      rotate: -5 + index * 2,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    animate={{
                      rotate: -5 + index * 2,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: -5 + index * 2 + 5,
                      zIndex: 10,
                      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ModelIcon
                      type={model as ModelIconType}
                      size="md"
                      rounded={false}
                    />
                  </motion.div>
                </Tooltip>
              );
            })}
          </Flex>
        </StaggerContainer>
      </div>
      — simply add your API keys and watch the magic unfold!
    </>
  );
};
