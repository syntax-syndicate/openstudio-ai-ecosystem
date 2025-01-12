import { Flex } from '@repo/design-system/components/ui/flex';
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
      <p className="pt-4 pb-2 font-semibold text-xl text-zinc-800 dark:text-zinc-50">
        {title}
      </p>
      {children}
    </Flex>
  );
};
