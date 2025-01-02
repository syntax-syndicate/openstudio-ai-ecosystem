import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { motion } from 'framer-motion';
import Markdown from 'marked-react';
import type { JSX } from 'react';

const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 3, ease: 'easeInOut', delay: 0.1 },
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
              className="text-zinc-100"
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
            return (
              <a href={href} target="_blank" rel="noreferrer">
                {text}
              </a>
            );
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
            <motion.strong
              initial="hidden"
              animate="visible"
              className="font-semibold"
            >
              {children}
            </motion.strong>
          ),
          code: (code, lang) => {
            return (
              <div className="my-4 w-full">
                <CodeBlock lang={lang} code={code?.toString()} />
              </div>
            );
          },
          codespan(code, lang) {
            return (
              <span className="rounded-md bg-[#41db8f]/20 px-2 py-1 text-[#41db8f] text-xs">
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
