import { PreviousMessages } from '@/app/(authenticated)/chat/components/messages/previous-messages';
import { RecentMessage } from '@/app/(authenticated)/chat/components/messages/recent-message';
import { WelcomeMessage } from '@/app/(authenticated)/chat/components/welcome-message';

export const ChatMessages = () => {
  return (
    <div
      className="flex h-[100dvh] w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      id="chat-container"
    >
      <div className="-translate-x-4 flex w-full flex-col items-start px-4 pt-4 md:w-[600px] lg:w-[680px]">
        <WelcomeMessage />
        <PreviousMessages />
        <RecentMessage />
      </div>
    </div>
  );
};
