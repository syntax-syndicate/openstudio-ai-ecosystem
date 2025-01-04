'use client';

import { BotLibrary } from '@/app/(authenticated)/chat/components/bots/bot-library';
import { CreateBot } from '@/app/(authenticated)/chat/components/bots/create-bot';
import { BotsContext } from '@/app/context/bots/context';
import { useChatContext } from '@/app/context/chat/context';
import type { TBot } from '@/app/hooks/use-bots';
import { useChatSession } from '@/app/hooks/use-chat-session';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { useState } from 'react';

export type TBotsProvider = {
  children: React.ReactNode;
};
export type TBotMenuItem = {
  name: string;
  key: string;
  icon: () => React.ReactNode;
  component: React.ReactNode;
};
export const BotsProvider = ({ children }: TBotsProvider) => {
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [showCreateBot, setShowCreateBot] = useState(false);
  const [tab, setTab] = useState<'public' | 'local'>('public');
  const { currentSession, createSession, refetchCurrentSession } =
    useChatContext();
  const { updateSession } = useChatSession();
  const open = (action?: 'public' | 'local' | 'create') => {
    if (action === 'create') {
      setShowCreateBot(true);
    } else {
      action && setTab(action);
    }
    setIsBotOpen(true);
  };
  const dismiss = () => setIsBotOpen(false);
  return (
    <BotsContext.Provider value={{ open, dismiss }}>
      {children}
      <Dialog open={isBotOpen} onOpenChange={setIsBotOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:max-h-[600px] md:min-w-[600px]">
          {showCreateBot ? (
            <CreateBot
              open={showCreateBot}
              onOpenChange={(isOpen) => {
                setShowCreateBot(isOpen);
                if (!isOpen) {
                  setTab('local');
                }
              }}
            />
          ) : (
            <BotLibrary
              open={!showCreateBot}
              tab={tab}
              assignBot={(bot: TBot) => {
                if (currentSession?.messages?.length) {
                  createSession(bot, true);
                } else {
                  currentSession?.id &&
                    updateSession(currentSession?.id, { bot }).then(() => {
                      refetchCurrentSession();
                    });
                }
                dismiss();
              }}
              onTabChange={setTab}
              onCreate={() => setShowCreateBot(true)}
            />
          )}
        </DialogContent>
      </Dialog>
    </BotsContext.Provider>
  );
};
