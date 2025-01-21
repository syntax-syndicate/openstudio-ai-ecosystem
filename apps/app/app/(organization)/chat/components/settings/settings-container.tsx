import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import type { ComponentProps, FC } from 'react';

export type TSettingsContainer = {
  children: React.ReactNode;
  title: string;
};

export const SettingsContainer: FC<
  TSettingsContainer & ComponentProps<typeof Flex>
> = ({ title, children, ...props }) => {
  return (
    <Flex
      direction="col"
      className={cn(
        'flex w-full flex-col items-start gap-4 px-3 md:px-5',
        props.className
      )}
      {...props}
    >
      <Type
        size="lg"
        weight="medium"
        className="w-full border-zinc-500/10 border-b pb-6"
      >
        {title}
      </Type>
      {children}
    </Flex>
  );
};
