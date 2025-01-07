import type { TChatMessage } from '@/types';
import { Edit02Icon } from '@hugeicons/react';
import { Quotes } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Flex } from '@repo/design-system/components/ui/flex';
import Image from 'next/image';

export type THumanMessage = {
  chatMessage: TChatMessage;
  isLast: boolean;
};
export const HumanMessage = ({ chatMessage, isLast }: THumanMessage) => {
  const { rawHuman, runConfig } = chatMessage;

  return (
    <>
      {runConfig?.context && (
        <div className="ml-16 flex flex-row gap-2 rounded-2xl border border-transparent bg-zinc-50 p-2 pr-4 pl-3 text-sm text-zinc-600 hover:border-white/5 md:ml-32 md:text-base dark:bg-black/30 dark:text-zinc-100">
          <Quotes size={16} weight="bold" className="mt-2 flex-shrink-0" />

          <span className="pt-[0.35em] pb-[0.25em] leading-6">
            {runConfig?.context}
          </span>
        </div>
      )}
      {runConfig?.image && (
        <div className="relative h-[120px] min-w-[120px] rounded-2xl border border-white/5 shadow-md">
          <Image
            src={runConfig?.image}
            alt="uploaded image"
            className="h-full w-full overflow-hidden rounded-2xl object-cover"
            width={0}
            sizes="50vw"
            height={0}
          />
        </div>
      )}
      <Flex className="ml-16 md:ml-32" gap="xs" items="center">
        {isLast && (
          <Button variant="ghost" size="iconSm">
            <Edit02Icon size={16} strokeWidth={2} />
          </Button>
        )}
        <div className="flex flex-row gap-2 rounded-2xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600 md:text-base dark:bg-black/30 dark:text-zinc-100">
          <span className="whitespace-pre-wrap pt-[0.20em] pb-[0.15em] leading-6">
            {rawHuman}
          </span>
        </div>
      </Flex>
    </>
  );
};
