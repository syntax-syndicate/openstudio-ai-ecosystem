import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import Link from 'next/link';

export const ChatFooter = () => {
  return (
    <Flex className="w-full px-4 py-1" justify="center" gap="xs">
      <Type
        size="xxs"
        textColor="tertiary"
        className="inline-block text-center"
      >
        OpenStudio ChatHub is open source{' '}
      </Type>
      <Type size="xxs" textColor="tertiary">
        project by{' '}
        <Link
          href="https://kuluruvineeth.com"
          target="_blank"
          className="inline-block pl-2 text-violet-500 underline decoration-zinc-500/20 underline-offset-2"
          rel="noreferrer"
        >
          {' '}
          kuluruvineeth
        </Link>
      </Type>
    </Flex>
  );
};
