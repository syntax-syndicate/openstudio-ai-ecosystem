'use client';
import { CreatePrompt } from '@/app/(authenticated)/chat/components/prompts/create-prompt';
import { PromptLibrary } from '@/app/(authenticated)/chat/components/prompts/prompt-library';
import { useChatContext } from '@/app/context/chat/provider';
import { PromptsContext } from '@/app/context/prompts/context';
import type { TPrompt } from '@/app/hooks/use-prompts';
import { usePrompts } from '@/app/hooks/use-prompts';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
  const [localPrompts, setLocalPrompts] = useState<TPrompt[]>([]);
  const { getPrompts } = usePrompts();
  const { editor } = useChatContext();

  const open = (action?: 'public' | 'local' | 'create') => {
    if (action === 'create') {
      setShowCreatePrompt(true);
    } else {
      action && setTab(action);
    }
    setIsPromptOpen(true);
  };

  const dismiss = () => setIsPromptOpen(false);

  const query = useQuery<{ prompts: TPrompt[] }>({
    queryKey: ['prompts'],
    queryFn: async () => axios.get('/api/prompts').then((res) => res.data),
  });

  useEffect(() => {
    getPrompts().then((prompts) => {
      setLocalPrompts(prompts);
    });
  }, [open]);

  const allPrompts = [...localPrompts, ...(query.data?.prompts || [])];

  return (
    <PromptsContext.Provider value={{ open, dismiss, allPrompts }}>
      {children}

      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:max-h-[600px] md:min-w-[640px]">
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
              onPromptSelect={(prompt) => {
                editor?.commands?.clearContent();
                editor?.commands?.setContent(prompt.content);
                editor?.commands?.focus('end');
                dismiss();
              }}
              localPrompts={localPrompts}
              publicPrompts={query.data?.prompts || []}
              onTabChange={setTab}
              onCreate={() => setShowCreatePrompt(true)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PromptsContext.Provider>
  );
};
