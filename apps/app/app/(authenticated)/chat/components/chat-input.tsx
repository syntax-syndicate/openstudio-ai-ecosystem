import { useChatContext } from '@/app/context/chat/context';
import { PromptType, RoleType } from '@/app/lib/prompts';
import { Input } from '@repo/design-system/components/ui/input';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState('');
  const { runModel } = useChatContext();

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

  return (
    <div className="absolute right-0 bottom-0 left-0 flex w-full flex-row bg-gradient-to-t from-70% from-white to-white/10 px-4 pt-16 pb-4">
      <Input
        placeholder="Ask AI anything.."
        value={inputValue}
        className="w-full"
        onChange={(e) => {
          setInputValue(e.currentTarget.value);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
