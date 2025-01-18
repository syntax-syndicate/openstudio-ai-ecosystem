import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { SearchFavicon } from '@/app/(authenticated)/chat/components/tools/search-favicon';
import { REVEAL_ANIMATION_VARIANTS } from '@/helper/animations';
import { isValidUrl } from '@/helper/utils';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Flex } from '@repo/design-system/components/ui/flex';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design-system/components/ui/hover-card';
import { Type } from '@repo/design-system/components/ui/text';
import { cn } from '@repo/design-system/lib/utils';
import { motion } from 'framer-motion';
import Markdown from 'marked-react';
import Link from 'next/link';
import type { FC, JSX, ReactNode } from 'react';

export type TMdx = {
  message?: string;
  animate: boolean;
  messageId?: string;
  size?: 'xs' | 'sm' | 'base';
};
const Mdx: FC<TMdx> = ({ message, animate, messageId, size = 'base' }) => {
  if (!message || !messageId) {
    return null;
  }

  const renderEm = (children: ReactNode) => <em>{children}</em>;

  const renderHeading = (children: ReactNode, level: number) => {
    const Heading = `h${level}` as keyof JSX.IntrinsicElements;
    return <Heading>{children}</Heading>;
  };
  const renderHr = () => (
    <hr className="my-4 border-black/5 dark:border-white/5" />
  );
  const renderLink = (href: string, text: ReactNode, messageId: string) => {
    if (text && isValidUrl(href)) {
      const url = new URL(href).host;
      return (
        <HoverCard>
          <HoverCardTrigger>
            <Link
              href={href}
              target="_blank"
              data-message-id={messageId}
              className="!my-0 !no-underline font-normal text-teal-600 dark:text-teal-600"
              rel="noreferrer"
            >
              {text}
            </Link>
          </HoverCardTrigger>
          <HoverCardContent
            sideOffset={12}
            className="flex max-w-[400px] cursor-pointer flex-col items-start rounded-lg p-2"
            onClick={() => {
              window.open(href, '_blank');
            }}
          >
            <Flex gap="sm" items="start" className="w-full text-zinc-500">
              <SearchFavicon link={url} className="!m-0 !mt-1" size="md" />
              <Type
                size="sm"
                textColor="secondary"
                className="line-clamp-2 flex-1"
              >
                {href}
              </Type>
              <ArrowUpRight
                size={16}
                weight="bold"
                className="mt-1 flex-shrink-0"
              />
            </Flex>
          </HoverCardContent>
        </HoverCard>
      );
    }
    return <></>;
  };
  const renderImage = (src: string, alt: string) => {
    return <></>;
  };
  const renderCode = (code: string, lang: string) => (
    <div className="not-prose my-4 w-full flex-shrink-0">
      <CodeBlock lang={lang} code={code?.toString()} />
    </div>
  );
  const renderCodespan = (code: string) => (
    <span className="mono rounded-md border bg-zinc-50 px-1 py-0.5 text-xs text-zinc-800 dark:bg-white/10 dark:text-white">
      {code}
    </span>
  );

  const articleClass = cn(
    'prose dark:prose-invert prose-zinc max-w-full !prose-heading:font-medium prose-h1:font-medium prose-h2:font-medium prose-h3:font-medium prose-h4:font-medium prose-h5:font-medium prose-h6:font-medium prose-strong:font-medium prose-h3:text-base prose-h4:text-sm prose-h5:text-sm prose-h6:text-sm prose-headings:text-base prose-th:text-sm md:prose-h3:text-base md:prose-h4:text-base md:prose-h5:text-base md:prose-h6:text-base',
    {
      'prose-sm': size === 'sm',
      'prose-sm md:prose-sm': size === 'base',
      'prose-xs': size === 'xs',
    }
  );

  const renderBr = () => <br />;

  return (
    <article className={articleClass} id={`message-${messageId}`}>
      <Markdown
        renderer={{
          text: (text) => text,
          paragraph: (children) => (
            <motion.p
              variants={REVEAL_ANIMATION_VARIANTS}
              animate={'visible'}
              initial={animate ? 'hidden' : 'visible'}
            >
              {children}
            </motion.p>
          ),
          em: renderEm,
          heading: renderHeading,
          hr: renderHr,
          br: renderBr,
          link: (href, text) => renderLink(href, text, messageId),
          image: renderImage,
          code: renderCode,
          codespan: renderCodespan,
        }}
        openLinksInNewTab={true}
      >
        {message}
      </Markdown>
    </article>
  );
};
Mdx.displayName = 'Mdx';
export { Mdx };
