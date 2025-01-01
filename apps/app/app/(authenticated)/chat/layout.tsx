import { Header } from '@/app/(authenticated)/components/header';
import { ChatProvider } from '@/app/context/chat/provider';
import { FiltersProvider } from '@/app/context/filters/provider';
import { SettingsProvider } from '@/app/context/settings/provider';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header pages={['Conversation']} page="Chat Sessions"></Header>
      <ChatProvider>
        <SettingsProvider>
          <FiltersProvider>
            <div className="flex h-screen w-full flex-row dark:bg-zinc-800">
              {children}
            </div>
          </FiltersProvider>
        </SettingsProvider>
      </ChatProvider>
    </>
  );
}
