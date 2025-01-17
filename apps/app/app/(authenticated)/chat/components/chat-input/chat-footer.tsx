import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';
import GitHubButton from 'react-github-btn';
export const ChatFooter = () => {
  return (
    <Flex
      className="absolute bottom-0 z-10 w-full px-4 py-2"
      justify="center"
      gap="sm"
    >
      <Type size="xxs" textColor="tertiary">
        OpenStudio ChatHub is open source{' '}
        <span className="inline-block px-1">
          <GitHubButton
            href="https://github.com/kuluruvineeth/openstudio-beta"
            data-color-scheme="no-preference: light; light: light; dark: dark;"
            aria-label="Star kuluruvineeth/openstudio-beta on GitHub"
          >
            Star
          </GitHubButton>{' '}
        </span>
      </Type>
      <Type size="xxs" textColor="tertiary">
        project by{' '}
        <a
          href="https://kuluruvineeth.com"
          target="_blank"
          className="ml-1 text-teal-600 underline decoration-zinc-500/20 underline-offset-2"
          rel="noreferrer"
        >
          kuluruvineeth
        </a>
      </Type>
    </Flex>
  );
};
