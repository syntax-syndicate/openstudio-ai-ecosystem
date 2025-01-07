'use client';
import { CreatePrompt } from '@/app/(authenticated)/chat/components/prompts/create-prompt';
import { PromptLibrary } from '@/app/(authenticated)/chat/components/prompts/prompt-library';
import { useChatContext } from '@/context/chat';
import { type TPrompt, usePrompts } from '@/hooks/use-prompts';
import {
  Dialog,
  DialogContent,
} from '@repo/design-system/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createContext, useContext, useState } from 'react';

export type TPromptsContext = {
  open: (create?: boolean) => void;
  dismiss: () => void;
  allPrompts: TPrompt[];
};
export const PromptsContext = createContext<undefined | TPromptsContext>(
  undefined
);

export const usePromptsContext = () => {
  const context = useContext(PromptsContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptssProvider');
  }
  return context;
};

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
  const [editablePrompt, setEditablePrompt] = useState<TPrompt | undefined>(
    undefined
  );
  const {
    getPrompts,
    promptsQuery,
    createPromptMutation,
    deletePromptMutation,
    updatePromptMutation,
  } = usePrompts();
  const { store } = useChatContext();
  const editor = store((state) => state.editor);

  const open = (create?: boolean) => {
    if (create) {
      setShowCreatePrompt(true);
    }
    setIsPromptOpen(true);
  };

  const dismiss = () => setIsPromptOpen(false);

  const localPromptsQuery = promptsQuery;

  const publicPromptsQuery = useQuery<{ prompts: TPrompt[] }>({
    queryKey: ['Prompts'],
    queryFn: async () => axios.get('/api/prompts').then((res) => res.data),
  });

  const allPrompts = [
    ...(localPromptsQuery.data || []),
    ...(publicPromptsQuery.data?.prompts || []),
  ];

  return (
    <PromptsContext.Provider value={{ open, dismiss, allPrompts }}>
      {children}

      <Dialog open={isPromptOpen} onOpenChange={setIsPromptOpen}>
        <DialogContent className="flex max-h-[80dvh] w-[96dvw] flex-col gap-0 overflow-hidden rounded-2xl border border-white/5 p-0 md:max-h-[600px] md:w-[600px]">
          {showCreatePrompt ? (
            <CreatePrompt
              prompt={editablePrompt}
              open={showCreatePrompt}
              onOpenChange={(isOpen) => {
                setShowCreatePrompt(isOpen);
              }}
              onCreatePrompt={(prompt) => {
                createPromptMutation.mutate(prompt);
              }}
              onUpdatePrompt={(prompt) => {
                editablePrompt?.id &&
                  updatePromptMutation.mutate({
                    id: editablePrompt?.id,
                    prompt,
                  });
              }}
            />
          ) : (
            <PromptLibrary
              onPromptSelect={(prompt) => {
                editor?.commands?.clearContent();
                editor?.commands?.setContent(prompt.content);
                editor?.commands?.focus('end');
                dismiss();
              }}
              onEdit={(prompt) => {
                setEditablePrompt(prompt);
                setShowCreatePrompt(true);
              }}
              onDelete={(prompt) => deletePromptMutation.mutate(prompt.id)}
              localPrompts={localPromptsQuery.data || []}
              publicPrompts={publicPromptsQuery.data?.prompts || []}
              onCreate={() => setShowCreatePrompt(true)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PromptsContext.Provider>
  );
};
