import { motion } from 'framer-motion';
import Markdown from 'marked-react';
import type { JSX } from 'react';
import { CodeBlock } from '../(authenticated)/chat/components/codeblock';
import { LinkBlock } from '../(authenticated)/chat/components/link-block';

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
          <p className="text-sm leading-7">{children}</p>
        ),
        heading: (children, level) => {
          const Heading = `h${level}` as keyof JSX.IntrinsicElements;
          return <Heading className="font-medium text-md">{children}</Heading>;
        },
        link: (href) => <LinkBlock url={href} />,
        blockquote: (children) => (
          <blockquote className="border-gray-300 border-l-4 pl-4 italic">
            <p className="text-sm leading-7 ">{children}</p>
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
            <p className="text-sm leading-7 ">{children}</p>
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
          <span className="rounded-md bg-zinc-50 px-2 py-1 font-medium text-xs text-zinc-800 dark:bg-white/10 dark:text-white">
            {code}
          </span>
        ),
      }}
    >
      {message}
    </Markdown>
  );

  return { renderMarkdown };
};
