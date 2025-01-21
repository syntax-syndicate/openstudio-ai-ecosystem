import {
  createPrompt,
  deletePrompt,
  getPrompts,
  updatePrompt,
} from '@/services/prompts/client';
import type { TPrompt } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usePromptsQueries = () => {
  const promptsQuery = useQuery({
    queryKey: ['prompts'],
    queryFn: () => getPrompts(),
  });
  const createPromptMutation = useMutation({
    mutationFn: (prompt: Omit<TPrompt, 'id'>) => createPrompt(prompt),
    onSuccess: () => {
      promptsQuery.refetch();
    },
  });
  const updatePromptMutation = useMutation({
    mutationFn: ({
      id,
      prompt,
    }: {
      id: string;
      prompt: Partial<Omit<TPrompt, 'id'>>;
    }) => updatePrompt(id, prompt),
    onSuccess: () => {
      promptsQuery.refetch();
    },
  });
  const deletePromptMutation = useMutation({
    mutationFn: (id: string) => deletePrompt(id),
    onSuccess: () => {
      promptsQuery.refetch();
    },
  });
  return {
    promptsQuery,
    createPromptMutation,
    updatePromptMutation,
    deletePromptMutation,
  };
};
