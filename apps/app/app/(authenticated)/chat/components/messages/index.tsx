import { PreviousMessages } from '@/app/(authenticated)/chat/components/messages/previous-messages';
import { RecentMessage } from '@/app/(authenticated)/chat/components/messages/recent-message';

export const ChatMessages = () => {
  return (
    <div
      className="no-scrollbar flex h-[100dvh] w-full flex-col items-center overflow-y-auto pt-[60px] pb-[200px]"
      id="chat-container"
    >
      <div className="flex w-full flex-1 flex-col gap-24 p-2 md:w-[700px] lg:w-[720px]">
        <div className="flex w-full flex-col items-start gap-8">
          <PreviousMessages />
          <RecentMessage />
        </div>
      </div>
    </div>
  );
};
