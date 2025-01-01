import { Sidebar } from '@/app/(authenticated)/chat/components/sidebar';
import { Header } from '@/app/(authenticated)/components/header';
import { ChatProvider } from '@/app/context/chat/provider';
import { FiltersProvider } from '@/app/context/filters/provider';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header pages={['Conversation']} page="Chat Sessions"></Header>
      <ChatProvider>
        <FiltersProvider>
            <div className="w-full h-screen flex flex-row dark:bg-zinc-800">
              {children}
            </div>
          </FiltersProvider>
      </ChatProvider>
    </>
  );
}
