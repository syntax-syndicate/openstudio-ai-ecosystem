import { examplePrompts } from '@/config';
import { useChatContext } from '@/context';
import { Button } from '@repo/design-system/components/ui';
import { Flex } from '@repo/design-system/components/ui/flex';
import { Type } from '@repo/design-system/components/ui/text';

export const ChatExamples = () => {
  const { store } = useChatContext();
  const editor = store((state) => state.editor);

  return (
    <Flex direction="col" gap="md" justify="center" items="center">
      <div className="flex flex-col gap-3 p-4">
        <Type size="sm" textColor="tertiary">
          Try Prompts
        </Type>
        <div className="flex grid w-full grid-cols-1 flex-col gap-3 md:w-[700px] md:grid-cols-2 lg:w-[720px]">
          {examplePrompts?.slice(0, 4)?.map((prompt, index) => (
            <Button
              key={index}
              rounded="full"
              className="justify-start"
              onClick={() => {
                editor?.commands?.clearContent();
                editor?.commands?.setContent(prompt.content);
                editor?.commands?.focus('end');
              }}
            >
              {prompt.name}
            </Button>
          ))}
        </div>
      </div>
    </Flex>
  );
};
