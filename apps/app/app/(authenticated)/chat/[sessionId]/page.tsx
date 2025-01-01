'use client';

import { ChatInput } from '@/app/(authenticated)/chat/components/chat-input';
import { ChatMessages } from '@/app/(authenticated)/chat/components/chat-messages';
import { ModelSelect } from '@/app/(authenticated)/chat/components/model-select';
import { useSettings } from '@/app/context/settings/context';
import { DotsThree } from '@phosphor-icons/react';
import { Button } from '@repo/design-system/components/ui/button';
import { Avatar } from '@repo/design-system/components/ui/custom-avatar';

const chatSessionPage = () => {
  const { open } = useSettings();
  return (
    <div className="relative flex h-screen w-full flex-row overflow-hidden">
      <div className="absolute top-0 right-0 left-0 z-10 flex flex-row items-center justify-between bg-gradient-to-b from-70% to-white/10 p-2 dark:from-zinc-800 dark:to-transparent">
        <p className="p-2 text-sm text-zinc-500">ChatHub</p>
        <div className="flex flex-row items-center gap-2">
          <ModelSelect />
          <Avatar name="Vineeth" size={28} />
          <Button variant="secondary" size="iconSm" onClick={open}>
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
