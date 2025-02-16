import { AIMessage } from '@/app/(organization)/chat/components/messages/ai/ai-message';
import { ContextMessage } from '@/app/(organization)/chat/components/messages/context-message';
import { HumanMessage } from '@/app/(organization)/chat/components/messages/human-message';
import { ImageMessage } from '@/app/(organization)/chat/components/messages/image-message';
import type { TChatMessage } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Flex } from '@repo/design-system/components/ui/flex';
import { cn } from '@repo/design-system/lib/utils';
import { type FC, forwardRef } from 'react';


export type TMessage = {
  message: TChatMessage;
  isLast: boolean;
};

const CustomTrigger = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof AccordionTrigger>
>(({ children, ...props }, ref) => (
  <AccordionHeader className="flex w-full rounded-xl p-2 hover:bg-zinc-500/10">
    <AccordionTrigger
      {...props}
      ref={ref}
      className="group flex w-full items-center justify-between"
    >
      <Flex className="w-full flex-1 items-start">{children}</Flex>
    </AccordionTrigger>
  </AccordionHeader>
));

CustomTrigger.displayName = 'CustomTrigger';

export const Message: FC<TMessage> = ({ message, isLast}) => {
  return (
    <Accordion
      type="single"
      className="w-full"
      collapsible
      defaultValue={message.id}
    >
      <AccordionItem
        value={message.id}
        key={message.id}
        className={cn(
          'flex w-full flex-col items-start gap-1 py-2',
          isLast && 'border-b-0'
        )}
      >
        <CustomTrigger>
          <Flex direction="col" gap="md" items="start">
            <ImageMessage image={message.runConfig?.image} />
            <ContextMessage context={message.runConfig?.context} />
            <HumanMessage chatMessage={message} />
          </Flex>
        </CustomTrigger>
        <AccordionContent className="w-full items-start p-2">
          <AIMessage message={message} isLast={isLast} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
