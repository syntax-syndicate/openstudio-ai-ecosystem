import { motion } from 'framer-motion';
import Markdown from 'marked-react';

import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { ArrowUpRight, Link } from '@phosphor-icons/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design-system/components/ui/hover-card';
import { type ReactNode, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';

export const REVEAL_ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: 'easeInOut', delay: 0.1 },
  },
};

export type TLink = {
  href: string;
  text: ReactNode;
};
export const useMarkdown = () => {
  const [links, setLinks] = useState<TLink[]>([]);

  const renderMarkdown = (
    message: string,
    animate: boolean,
    messageId: string
  ) => (
    <Markdown
      renderer={{
        text: (children) => (
          <motion.span
            variants={REVEAL_ANIMATION_VARIANTS}
            animate={'visible'}
            initial={animate ? 'hidden' : 'visible'}
          >
            {children}
          </motion.span>
        ),
        paragraph: (children) => <p>{children}</p>,
        em: (children) => <em>{children}</em>,
        heading: (children, level) => {
          const Heading = `h${level}` as keyof JSX.IntrinsicElements;
          return <Heading>{children}</Heading>;
        },
        hr: () => <hr className="my-4 border-gray-100 dark:border-white/10" />,
        link: (href, text) => {
          if (text && href) {
            return (
              <HoverCard>
                <HoverCardTrigger>
                  <a href={href} data-message-id={messageId}>
                    {text}
                  </a>
                </HoverCardTrigger>
                <HoverCardContent
                  sideOffset={12}
                  className="flex max-w-[500px] cursor-pointer flex-col items-start rounded-xl bg-zinc-700 p-3 hover:bg-zinc-800"
                  onClick={() => {
                    window.open(href, '_blank');
                  }}
                >
                  <p className="flex flex-row items-center gap-2 overflow-hidden whitespace-pre-wrap font-normal text-xs text-zinc-200 leading-7w-full dark:text-zinc-200">
                    <Link
                      size={16}
                      weight="bold"
                      className="flex-shrink-0 text-white"
                    />
                    {href}
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      className="flex-shrink-0 text-white"
                    />
                  </p>
                </HoverCardContent>
              </HoverCard>
            );
          }
          return <></>;
        },
        blockquote: (children) => (
          <blockquote>
            <p>{children}</p>
          </blockquote>
        ),
        list: (children, ordered) =>
          ordered ? <ol>{children}</ol> : <ul>{children}</ul>,
        listItem: (children) => (
          <li>
            <p>{children}</p>
          </li>
        ),
        strong: (children) => <strong>{children}</strong>,
        code: (code, lang) => (
          <div className="not-prose my-4 w-full flex-shrink-0">
            <CodeBlock lang={lang} code={code?.toString()} />
          </div>
        ),
        codespan: (code) => (
          <span className="rounded-md bg-zinc-50 px-2 py-1 font-medium text-sm text-zinc-800 md:text-base dark:bg-white/10 dark:text-white">
            {code}
          </span>
        ),
        br: () => <br />,
        table: (children) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-zinc-100 dark:border-white/10 ">
            <table className="w-full overflow-hidden text-left text-gray-600 text-sm md:text-base rtl:text-right dark:text-gray-200">
              {children}
            </table>
          </div>
        ),
        tableHeader(children) {
          return (
            <thead className="w-full bg-zinc-50 font-medium text-sm text-zinc-800 uppercase md:text-base dark:bg-white/10 dark:text-white/20">
              {children}
            </thead>
          );
        },

        tableRow(children) {
          return (
            <tr className="hover:bg-zinc-50 dark:bg-white/5">{children}</tr>
          );
        },
        tableCell(children, flags) {
          if (flags.header) {
            return <th className="p-3 text-sm md:text-base">{children}</th>;
          }
          return <td className="p-3 text-sm md:text-base">{children}</td>;
        },
        tableBody: (children) => <tbody>{children}</tbody>,
      }}
    >
      {message}
    </Markdown>
  );

  return { renderMarkdown, links };
};
