import { Header } from '@/app/(authenticated)/components/header';
import { ChatProvider } from '@/app/context/chat/provider';
import { FiltersProvider } from '@/app/context/filters/provider';
import { SettingsProvider } from '@/app/context/settings/provider';
import { Toaster } from '@repo/design-system/components/ui/sonner';
import { TooltipProvider } from '@repo/design-system/components/ui/tooltip';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header pages={['Conversation']} page="Chat Sessions"></Header>
      <TooltipProvider>
        <SettingsProvider>
          <ChatProvider>
            <FiltersProvider>
              <div className="flex h-screen w-full flex-row bg-[#E9E9EC] dark:bg-zinc-800">
                {children}
                <Toaster />
              </div>
            </FiltersProvider>
          </ChatProvider>
        </SettingsProvider>
      </TooltipProvider>
    </>
  );
}
