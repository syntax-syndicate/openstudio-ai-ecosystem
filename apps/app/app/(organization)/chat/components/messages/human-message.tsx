import type { TChatMessage } from '@/types';
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
} from '@hugeicons-pro/core-stroke-rounded';
import { HugeiconsIcon } from '@hugeicons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import Avvvatars from 'avvvatars-react';
import { useEffect, useRef, useState } from 'react';

export type THumanMessage = {
  chatMessage: TChatMessage;
};

export const HumanMessage = ({ chatMessage }: THumanMessage) => {
  const { rawHuman } = chatMessage;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShowReadMore(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [rawHuman]);

  if (!rawHuman) return null;

  return (
    <div className="relative w-full">
      <Flex className="w-full items-start" gap="md">
        <Flex className="mt-0.5">
          {/* @ts-ignore */}
          <Avvvatars
            displayValue={'A'}
            value={'ChatHub'}
            style={'shape'}
            size={26}
          />
        </Flex>
        <Flex direction="col" className="mt-1 flex-1" gap="sm">
          <Type
            size="base"
            weight="medium"
            className={cn('relative whitespace-break-spaces text-left', {
              'line-clamp-2': !isExpanded,
            })}
            ref={contentRef}
          >
            {rawHuman}
          </Type>
          {showReadMore && (
            <Type
              onClick={(e) => {
                setIsExpanded(!isExpanded);
                e.stopPropagation();
              }}
              className="items-center gap-1 opacity-60 hover:underline hover:opacity-100"
            >
              {isExpanded ? (
                <>
                  <HugeiconsIcon
                    icon={ArrowUp01Icon}
                    size={14}
                    strokeWidth={2}
                  />
                  Read Less
                </>
              ) : (
                <>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={14}
                    strokeWidth={2}
                  />
                  Read More
                </>
              )}
            </Type>
          )}
        </Flex>
      </Flex>
    </div>
  );
};
