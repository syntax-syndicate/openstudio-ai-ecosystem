import { SparklesIcon } from '@hugeicons/react';
import { cn } from '@repo/design-system/lib/utils';
import Image from 'next/image';

export type ModelIconType =
  | 'gpt3'
  | 'gpt4'
  | 'anthropic'
  | 'gemini'
  | 'openai'
  | 'chathub'
  | 'websearch'
  | 'calculator'
  | 'duckduckgo_search'
  | 'website_reader'
  | 'ollama'
  | 'custom';

export type TModelIcon = {
  type: ModelIconType;
  size: 'sm' | 'md' | 'lg';
};

export const ModelIcon = ({ type, size }: TModelIcon) => {
  const iconSrc = {
    gpt3: '/icons/gpt3.svg',
    gpt4: '/icons/gpt4.svg',
    anthropic: '/icons/claude.svg',
    gemini: '/icons/gemini.svg',
    openai: '/icons/openai.svg',
    chathub: '/icons/chathub.svg',
    websearch: '/icons/websearch.svg',
    calculator: '/icons/calculator.svg',
    duckduckgo_search: '/icons/duckduckgo.svg',
    website_reader: '/icons/website_reader.svg',
    ollama: '/icons/ollama.svg',
  };

  if (type === 'custom') {
    return (
      <div
        className={cn(
          'flex h-6 min-w-6 items-center justify-center rounded-lg bg-teal-500 text-white',
          size === 'sm' && 'h-6 min-w-6',
          size === 'md' && 'h-8 min-w-8',
          size === 'lg' && 'h-10 min-w-10'
        )}
      >
        <SparklesIcon size={16} strokeWidth={1.5} variant="solid" />
      </div>
    );
  }

  return (
    <Image
      src={iconSrc[type]}
      width={0}
      height={0}
      alt={type}
      className={cn(
        'object-cover',
        size === 'sm' && 'h-6 min-w-6',
        size === 'md' && 'h-8 min-w-8',
        size === 'lg' && 'h-10 min-w-10'
      )}
      sizes="100vw"
    />
  );
};
