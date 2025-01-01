import { useChatContext } from '@/app/context/chat/context';
import { PromptType, RoleType } from '@/app/lib/prompts';
import { Command, Plus, Sparkle } from '@phosphor-icons/react';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { cn } from '@repo/design-system/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const ChatInput = () => {
  const { sessionId } = useParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const { runModel, createSession, currentSession, error } = useChatContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runModel(
        {
          role: RoleType.assistant,
          type: PromptType.ask,
          query: inputValue,
        },
        sessionId!.toString()
      );
      setInputValue('');
    }
  };

  useEffect(() => {
    if (sessionId) {
      inputRef.current?.focus();
    }
  }, [sessionId]);

  const isNewSession = !currentSession?.messages?.length;

  const examples = [
    'What is the capital of France?',
    'What is the weather in New York?',
    'What is the population of India?',
    'What is the GDP of China?',
  ];

  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 left-0 flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-t from-70% from-white to-white/10 px-4 pt-16 pb-4 transition-all duration-1000 ease-in-out dark:from-zinc-800 dark:to-transparent',
        isNewSession || (error && 'top-0')
      )}
    >
      {isNewSession ||
        (error && (
          <div className="flex h-[200px] flex-col items-center justify-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/10 text-xl">
              <Sparkle weight="bold" size={24} className="text-green-400" />
            </div>
            <h1 className="text-lg text-zinc-500 tracking-tight">
              How can i help you today?
            </h1>
          </div>
        ))}
      <div className="flex w-[700px] flex-row items-center rounded-2xl bg-white/10 px-3">
        <Button
          size="icon"
          className="h-8 min-w-8"
          onClick={() => {
            createSession().then((session) => {
              router.push(`/chat/${session.id}`);
            });
          }}
        >
          <Plus size={16} weight="bold" />
        </Button>
        <Input
          placeholder="Ask AI anything.."
          value={inputValue}
          ref={inputRef}
          variant="ghost"
          onChange={(e) => {
            setInputValue(e.currentTarget.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <Badge>
          <Command size={14} weight="bold" />K
        </Badge>
      </div>
      {isNewSession ||
        (error && (
          <div className="grid w-[700px] grid-cols-2 gap-2">
            {examples?.map((example, index) => (
              <div
                className="flex w-full cursor-pointer flex-row items-center rounded-2xl border border-white/5 bg-black/10 px-4 py-3 text-sm text-zinc-400 hover:scale-[101%] hover:bg-black/20"
                key={index}
                onClick={() => {
                  runModel(
                    {
                      role: RoleType.assistant,
                      type: PromptType.ask,
                      query: example,
                    },
                    sessionId!.toString()
                  );
                }}
              >
                {example}
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
