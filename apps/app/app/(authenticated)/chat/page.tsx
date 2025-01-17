'use client';
import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/messages';
import {
  AssistantsProvider,
  ChatProvider,
  CommandsProvider,
  PromptsProvider,
  useSessions,
} from '@/context';
import { FullPageLoader } from '@repo/design-system/components/ui/full-page-loader';

const ChatSessionPage = () => {
  const { activeSessionId } = useSessions();

  if (!activeSessionId) return <FullPageLoader label="Initializing chat" />;
  return (
    <ChatProvider sessionId={activeSessionId}>
      <CommandsProvider>
        <AssistantsProvider>
          <PromptsProvider>
            <div className="relative flex h-[100%] w-full flex-row overflow-hidden">
              <ChatMessages />
              <ChatInput />
            </div>
          </PromptsProvider>
        </AssistantsProvider>
      </CommandsProvider>
    </ChatProvider>
  );
};
export default ChatSessionPage;
