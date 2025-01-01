import { useChatContext } from '@/app/context/chat/context';
import { PromptType, RoleType } from '@/app/lib/prompts';
import { Input } from '@repo/design-system/components/ui/input';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState('');
  const { runModel } = useChatContext();
  return (
    <div className="flex h-8 w-full flex-row bg-gray-100">
      <Input
        placeholder="Ask AI anything.."
        onChange={(e) => {
          setInputValue(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            runModel(
              {
                role: RoleType.assistant,
                type: PromptType.ask,
                query: inputValue,
              },
              sessionId!.toString()
            );
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
};
