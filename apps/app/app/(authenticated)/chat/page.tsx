'use client';
import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages';
import { ChatProvider, PromptsProvider, useSessions } from '@/context';
import { Flex } from '@repo/design-system/components/ui/flex';
import { FullPageLoader } from '@repo/design-system/components/ui/full-page-loader';

const ChatSessionPage = () => {
  const { activeSessionId } = useSessions();

  if (!activeSessionId) return <FullPageLoader label="Initializing chat" />;
  return (
    <ChatProvider sessionId={activeSessionId}>
      <PromptsProvider>
        {activeSessionId ? (
          <Flex className="w-full" direction="col">
            <ChatMessages />
            <ChatInput />
          </Flex>
        ) : (
          <FullPageLoader label="Initializing chat" />
        )}
      </PromptsProvider>
    </ChatProvider>
  );
};
export default ChatSessionPage;
