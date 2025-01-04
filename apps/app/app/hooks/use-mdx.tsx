import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { motion } from 'framer-motion';
import Markdown from 'marked-react';
import type { JSX } from 'react';

const VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: 'easeInOut', delay: 0.1 },
  },
};

export const useMarkdown = () => {
  const renderMarkdown = (message: string, animate: boolean) => (
    <Markdown
      renderer={{
        text: (children) => (
          <motion.span
            variants={VARIANTS}
            className="text-zinc-700 tracking-[0.01em] dark:text-zinc-100"
            animate={'visible'}
            initial={animate ? 'hidden' : 'visible'}
          >
            {children}
          </motion.span>
        ),
        paragraph: (children) => (
          <p className="text-sm leading-7 md:text-base">{children}</p>
        ),
        heading: (children, level) => {
          const Heading = `h${level}` as keyof JSX.IntrinsicElements;
          return <Heading className="font-medium text-md">{children}</Heading>;
        },
        link: (href, text) => (
          <a
            href={href}
            className="rounded-md px-1 py-1 underline decoration-blue-300 underline-offset-4 hover:bg-zinc-50 dark:bg-white/10"
          >
            {text}
          </a>
        ),
        blockquote: (children) => (
          <blockquote className="border-gray-300 border-l-4 pl-4 italic">
            <p className="text-sm leading-7 md:text-base ">{children}</p>
          </blockquote>
        ),
        list: (children, ordered) =>
          ordered ? (
            <ol className="ml-8 list-decimal">{children}</ol>
          ) : (
            <ul className="ml-8 list-disc">{children}</ul>
          ),
        listItem: (children) => (
          <li className="my-4">
            <p className="text-sm leading-7 md:text-base ">{children}</p>
          </li>
        ),
        strong: (children) => (
          <strong className="font-semibold">{children}</strong>
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

  return { renderMarkdown };
};
