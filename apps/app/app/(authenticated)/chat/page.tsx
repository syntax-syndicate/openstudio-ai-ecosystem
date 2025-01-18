'use client';
import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatTopActions } from '@/app/(authenticated)/chat/components/chat-input/chat-top-actions';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages';
import { ChatProvider, PromptsProvider, useSessions } from '@/context';
import { Flex } from '@repo/design-system/components/ui/flex';

const ChatSessionPage = () => {
  const { activeSessionId } = useSessions();

  return (
    <ChatProvider sessionId={activeSessionId}>
      <PromptsProvider>
        <Flex className="w-full" direction="col">
          <Flex
            direction="row"
            className="absolute top-0 z-20 w-full rounded-t-md border-zinc-500/10 border-b bg-zinc-25 dark:bg-zinc-800"
          >
            <ChatTopActions />
          </Flex>
          <ChatMessages />
          <ChatInput />
        </Flex>
      </PromptsProvider>
    </ChatProvider>
  );
};
export default ChatSessionPage;
