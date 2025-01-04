import { useClipboard } from '@/app/hooks/use-clipboard';
import { ibmPlex } from '@/app/lib/fonts';
import { Check } from '@phosphor-icons/react';
import { Copy } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/design-system/components/ui/tooltip';
import { cn } from '@repo/design-system/lib/utils';
import hljs from 'highlight.js';
import { useEffect, useRef } from 'react';

export type codeBlockProps = {
  lang?: string;
  code?: string;
};

export const CodeBlock = ({ lang, code }: codeBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  const { copiedText, copy, showCopied } = useClipboard();
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
        'w-full flex-shrink-0 rounded-2xl border border-transparent bg-zinc-50/50 text-zinc-600 dark:border-white/5 dark:bg-black/20 dark:text-white'
      )}
    >
      <div className="flex w-full items-center justify-between p-2">
        <p className="px-2 text-sm md:text-base text-zinc-500">{language}</p>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                code && copy(code);
              }}
            >
              {showCopied ? (
                <Check size={16} weight="bold" />
              ) : (
                <Copy size={16} weight="bold" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent collisionPadding={4}>
            {showCopied ? 'copied' : 'copy'}
          </TooltipContent>
        </Tooltip>
      </div>
      <pre className="w-full px-6 py-2">
        <code
          style={ibmPlex.style}
          className={`hljs language-${language} inline-block w-full overflow-x-auto whitespace-pre-wrap break-words pr-[100%] text-sm md:text-base tracking-wide`}
          ref={ref}
        ></code>
      </pre>
    </div>
  );
};
