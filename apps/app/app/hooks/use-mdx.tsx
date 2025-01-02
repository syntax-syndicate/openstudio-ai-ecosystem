import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { LinkBlock } from '@/app/(authenticated)/chat/components/link-block';
import { motion } from 'framer-motion';
import Markdown from 'marked-react';
import type { JSX } from 'react';

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: 'easeInOut', delay: 0.1 },
  },
};

export const useMarkdown = () => {
  const renderMarkdown = (message: string, animate: boolean) => {
    return (
      <Markdown
        renderer={{
          text: (children) => (
            <motion.span
              variants={variants}
              animate={'visible'}
              className="text-zinc-700 tracking-[0.01em] dark:text-zinc-100"
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
            return <h1 className="font-medium text-md">{children}</h1>;
          },
          link: (href, text) => {
            return <LinkBlock url={href} />;
          },
          blockquote: (children) => (
            <div>
              <p className="text-sm leading-7">{children}</p>
            </div>
          ),
          list: (children, ordered) => {
            if (ordered) {
              return <ol className="ml-8 list-decimal">{children}</ol>;
            }
            return <ul className="ml-8 list-disc">{children}</ul>;
          },
          listItem: (children) => (
            <li className="my-4">
              <p className="text-sm leading-7 ">{children}</p>
            </li>
          ),
          strong: (children) => (
            <strong className="font-semibold">{children}</strong>
          ),
          code: (code, lang) => {
            return (
              <div className="my-4 w-full flex-shrink-0">
                <CodeBlock lang={lang} code={code?.toString()} />
              </div>
            );
          },
          codespan(code, lang) {
            return (
              <span className="rounded-md bg-zinc-50 px-2 py-1 font-medium text-xs text-zinc-800 dark:bg-white/10 dark:text-white">
                {code}
              </span>
            );
          },
        }}
      >
        {message}
      </Markdown>
    );
  };
  return { renderMarkdown };
};
