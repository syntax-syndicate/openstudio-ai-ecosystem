'use client';
import { CreatePrompt } from '@/app/(authenticated)/chat/components/prompts/create-prompt';
import { PromptLibrary } from '@/app/(authenticated)/chat/components/prompts/prompt-library';
import { PromptsContext } from '@/app/context/prompts/context';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { useState } from 'react';

export type TPromptsProvider = {
  children: React.ReactNode;
};

export type TPromptMenuItem = {
  name: string;
  key: string;
  icon: () => React.ReactNode;
  component: React.ReactNode;
};
export const PromptsProvider = ({ children }: TPromptsProvider) => {
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);
  const [tab, setTab] = useState<'public' | 'local'>('public');

  const open = (action?: 'public' | 'local' | 'create') => {
    if (action === 'create') {
      setShowCreatePrompt(true);
    } else {
      action && setTab(action);
    }
    setIsPromptOpen(true);
  };

  const dismiss = () => setIsPromptOpen(false);

  return (
    <PromptsContext.Provider value={{ open, dismiss }}>
      {children}

      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:max-h-[600px] md:min-w-[600px]">
          {showCreatePrompt ? (
            <CreatePrompt
              open={showCreatePrompt}
              onOpenChange={(isOpen) => {
                setShowCreatePrompt(isOpen);
                if (!isOpen) {
                  setTab('local');
                }
              }}
            />
          ) : (
            <PromptLibrary
              open={!showCreatePrompt}
              tab={tab}
              onTabChange={setTab}
              onCreate={() => setShowCreatePrompt(true)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PromptsContext.Provider>
  );
};
