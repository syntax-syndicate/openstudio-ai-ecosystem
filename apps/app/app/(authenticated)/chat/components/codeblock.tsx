import { useClipboard } from '@/hooks/use-clipboard';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Copy01Icon,
  Tick01Icon,
} from '@repo/design-system/components/ui/icons';
import { Tooltip } from '@repo/design-system/components/ui/tooltip-with-content';
import { cn } from '@repo/design-system/lib/utils';
import hljs from 'highlight.js';
import { useEffect, useRef } from 'react';

export type codeBlockProps = {
  lang?: string;
  code?: string;
  showHeader?: boolean;
};

export const CodeBlock = ({
  lang,
  code,
  showHeader = true,
}: codeBlockProps) => {
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
        'not-prose w-full flex-shrink-0 overflow-hidden rounded-lg border border-zinc-500/15 bg-white text-zinc-800 dark:border-white/5 dark:bg-black/20 dark:text-white'
      )}
    >
      {showHeader && (
        <div className="flex w-full items-center justify-between border-zinc-200/20 border-b bg-zinc-25 py-1.5 pr-1.5 pl-2 dark:border-white/5 dark:bg-black/20">
          <p className="px-2 text-xs text-zinc-500">{language}</p>
          <Tooltip content={showCopied ? 'Copied!' : 'Copy'}>
            <Button
              variant="ghost"
              size="xs"
              rounded="default"
              onClick={() => {
                code && copy(code);
              }}
            >
              {showCopied ? (
                <Tick01Icon size={14} strokeWidth="2" />
              ) : (
                <Copy01Icon size={14} strokeWidth="2" />
              )}
              Copy
            </Button>
          </Tooltip>
        </div>
      )}
      <pre className="w-full px-6 py-2">
        <code
          className={`hljs mono language-${language} inline-block w-full overflow-x-auto whitespace-pre-wrap break-words pr-[100%] text-sm`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};
