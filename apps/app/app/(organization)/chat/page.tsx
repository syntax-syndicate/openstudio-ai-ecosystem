'use client';
import { ChatInput } from '@/app/(organization)/chat/components/chat-input';
import { ChatTopNav } from '@/app/(organization)/chat/components/chat-input/chat-top-nav';
import { ChatMessages } from '@/app/(organization)/chat/components/messages';
import { ChatProvider, PromptsProvider, useSessions } from '@/context';
import { Flex } from '@repo/design-system/components/ui/flex';

const ChatSessionPage = () => {
  const { activeSessionId } = useSessions();

  return (
    <ChatProvider sessionId={activeSessionId}>
      <PromptsProvider>
        <Flex className="w-full" direction="col">
          <ChatTopNav />
          <ChatMessages />
          <ChatInput />
        </Flex>
      </PromptsProvider>
    </ChatProvider>
  );
};
export default ChatSessionPage;
