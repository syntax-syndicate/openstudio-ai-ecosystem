import { ModelIcon } from '@/app/(authenticated)/chat/components/model-icon';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export type TWelcomeMessageProps = {
  show: boolean;
};

export const WelcomeMessage = ({ show }: TWelcomeMessageProps) => {
  if (!show) return null;
  return (
    <div className="flex w-full flex-row items-start justify-start gap-2 rounded-xl border border-zinc-500/10 bg-white shadow-sm md:w-[720px] dark:bg-zinc-700">
      <div className="flex w-full flex-col items-start p-2 md:flex-row">
        <div className="p-2 md:px-2 md:py-2">
          <ModelIcon type="chathub" size="sm" />
        </div>
        <Flex
          direction="col"
          gap="none"
          items="start"
          className="w-full flex-1 overflow-hidden p-1"
        >
          <Type size="sm">
            Introducing ChatHub! Your conversations remain confidential, saved
            on your device only, and never utilized for AI model training.
          </Type>
        </Flex>
      </div>
    </div>
  );
};
