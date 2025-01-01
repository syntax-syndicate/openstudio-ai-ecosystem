import { useClipboard } from '@/app/hooks/use-clipboard';
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { Button } from '@repo/design-system/components/ui/button';
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
    <div className="hljs-wrapper">
      <div className="flex w-full items-center justify-between py-2 pr-2 pl-4">
        <p className="text-xs">{language}</p>
        <Button
          size="iconXS"
          onClick={() => {
            code && copy(code);
          }}
        >
          {showCopied ? <CheckIcon /> : <CopyIcon />}
          {showCopied ? 'copied' : 'copy'}
        </Button>
      </div>
      <pre className="hljs-pre">
        <code className={`hljs language-${language}`} ref={ref}></code>
      </pre>
    </div>
  );
};
