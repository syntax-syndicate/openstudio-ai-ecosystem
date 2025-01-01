import { Sidebar } from '@/app/(authenticated)/chat/components/sidebar';
import { Header } from '@/app/(authenticated)/components/header';
import { ChatProvider } from '@/app/context/chat/provider';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header pages={['Conversation']} page="Chat Sessions"></Header>
      <ChatProvider>
        <div className="flex h-screen w-full flex-row">
          <Sidebar />
          {children}
        </div>
      </ChatProvider>
    </>
  );
}
