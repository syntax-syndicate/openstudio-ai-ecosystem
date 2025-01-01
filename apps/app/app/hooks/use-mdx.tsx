import { CodeBlock } from '@/app/(authenticated)/chat/components/codeblock';
import { cn } from '@repo/design-system/lib/utils';
import Markdown from 'marked-react';
import type { JSX } from 'react';

export const useMarkdown = () => {
  const renderMarkdown = (message: string) => {
    return (
      <Markdown
        renderer={{
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
            const List = ordered ? 'ol' : 'ul';
            return (
              <List
                className={cn(ordered ? 'list-decimal' : 'list-disc', 'ml-8')}
              >
                {children}
              </List>
            );
          },
          listItem: (children) => (
            <li className="my-4">
              <p className="text-sm leading-7">{children}</p>
            </li>
          ),
          code: (code, lang) => {
            return (
              <div className="my-4">
                <CodeBlock lang={lang} code={code?.toString()} />
              </div>
            );
          },
          codespan(code, lang) {
            return (
              <span className="rounded-md bg-purple-600/30 px-2 py-1 text-purple-300 text-xs">
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
