import { motion } from 'framer-motion';
import Markdown from 'marked-react';

import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { ArrowUpRight, Link } from '@phosphor-icons/react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@repo/design-system/components/ui/hover-card';
import { cn } from '@repo/design-system/lib/utils';
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
        paragraph: (children) => (
          <p className="text-sm text-zinc-700 leading-7 md:text-base dark:text-zinc-100">
            {children}
          </p>
        ),
        em: (children) => (
          <em className="text-sm italic opacity-50 md:text-base">{children}</em>
        ),
        heading: (children, level) => {
          const Heading = `h${level}` as keyof JSX.IntrinsicElements;
          return (
            <Heading
              className={cn('font-medium', level < 4 ? 'text-md' : 'text-base')}
            >
              {children}
            </Heading>
          );
        },
        hr: () => <hr className="my-4 border-gray-100 dark:border-white/10" />,
        link: (href, text) => {
          if (text && href) {
            return (
              <HoverCard>
                <HoverCardTrigger>
                  <a
                    href={href}
                    data-message-id={messageId}
                    className="rounded-md px-1 py-1 text-blue-500 underline decoration-blue-400/10 underline-offset-4 hover:bg-blue-400/10 hover:decoration-blue-400 dark:text-blue-300"
                  >
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
                  <p className="flex flex-row items-center gap-2 overflow-hidden whitespace-pre-wrap text-xs text-zinc-200 leading-7w-full dark:text-zinc-200">
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
          <blockquote className="border-gray-300 border-l-4 pl-4 italic">
            <p className="text-sm leading-7 md:text-base">{children}</p>
          </blockquote>
        ),
        list: (children, ordered) =>
          ordered ? (
            <ol className="ml-4 list-decimal text-sm md:text-base">
              {children}
            </ol>
          ) : (
            <ul className="ml-4 list-disc">{children}</ul>
          ),
        listItem: (children) => (
          <li className="my-4">
            <p className="text-sm leading-relaxed md:text-base">{children}</p>
          </li>
        ),
        strong: (children) => (
          <strong className="font-medium">{children}</strong>
        ),
        code: (code, lang) => (
          <div className="my-4 w-full flex-shrink-0">
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
