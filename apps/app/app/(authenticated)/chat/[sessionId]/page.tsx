'use client';

import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/chat-messages';
import { useSettings } from '@/app/context/settings/context';
import { DotsThree } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Avatar } from '@repo/design-system/components/ui/custom-avatar';

const chatSessionPage = () => {
  const { open } = useSettings();
  return (
    <div className="relative flex h-screen w-full flex-row overflow-hidden">
      <div className="absolute flex justify-between items-center p-2 flex-row top-0 left-0 right-0 bg-gradient-to-b dark:from-zinc-800 dark:to-transparent from-70% to-white/10 z-10">
        <p className="p-2 text-sm text-zinc-500">ChatHub</p>
        <div className="flex flex-row items-center gap-2">
          <Avatar name="Vineeth" />
          <Button variant="secondary" size="icon" onClick={open}>
            <DotsThree size={20} weight="bold" />
          </Button>
        </div>
      </div>
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
export default chatSessionPage;
