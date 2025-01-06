import { useClipboard } from '@/app/hooks/use-clipboard';
import { ibmPlex } from '@/app/lib/fonts';
import { Copy01Icon, Tick01Icon } from '@hugeicons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import hljs from 'highlight.js';
import { useEffect, useRef } from 'react';

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const { copy, showCopied } = useClipboard();
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(language, code).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <div
      className={cn(
        'not-prose w-full flex-shrink-0 overflow-hidden rounded-xl border border-zinc-50 bg-zinc-50/30 text-zinc-600 dark:border-white/5 dark:bg-black/20 dark:text-white'
      )}
    >
      <div className="flex w-full items-center justify-between border-zinc-50 border-b p-1 dark:border-white/5">
        <p className="px-2 text-xs text-zinc-500">{language}</p>
        <Tooltip content={showCopied ? 'Copied!' : 'Copy'}>
          <Button
            className="!text-xs"
            variant="text"
            size="sm"
            onClick={() => {
              code && copy(code);
            }}
          >
            {showCopied ? (
              <Tick01Icon size={14} variant="stroke" strokeWidth="2" />
            ) : (
              <Copy01Icon size={14} variant="stroke" strokeWidth="2" />
            )}{' '}
            Copy Code
          </Button>
        </Tooltip>
      </div>
      <pre className="w-full px-6 py-2">
        <code
          style={ibmPlex.style}
          className={`hljs language-${language} inline-block w-full overflow-x-auto whitespace-pre-wrap break-words pr-[100%] text-xs tracking-wide md:text-sm`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};
