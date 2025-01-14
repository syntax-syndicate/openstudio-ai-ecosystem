import { ChatExamples } from '@/app/(authenticated)/chat/components/chat-input/chat-examples';
import { Mdx } from '@/app/(authenticated)/chat/components/mdx';
import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { Flex } from '@repo/design-system/components/ui/flex';

export type TWelcomeMessageProps = {
  show: boolean;
};

export const WelcomeMessage = ({ show }: TWelcomeMessageProps) => {
  if (!show) return null;
  return (
    <div className="flex w-full flex-row items-start justify-start gap-2 md:w-[720px]">
      <div className="mt-6 flex w-full flex-col items-start md:flex-row">
        <div className="p-2 md:px-3 md:py-2">
          <ModelIcon type="chathub" size="sm" />
        </div>
        <Flex
          direction="col"
          gap="none"
          items="start"
          className="w-full flex-1 overflow-hidden p-2"
        >
          <Mdx
            message={`Introducing ChatHub! Your conversations remain confidential, saved on your device only, and never utilized for AI model training.`}
            animate={true}
            messageId={'intro-message'}
          />
          <ChatExamples />
        </Flex>
      </div>
    </div>
  );
};
