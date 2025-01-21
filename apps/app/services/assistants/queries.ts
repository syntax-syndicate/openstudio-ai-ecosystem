import type { TCustomAssistant } from '@repo/backend/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAssistants,
  createAssistant,
  getAllAssistants,
  removeAssistant,
  updateAssistant,
} from './client';

export const useAssistantsQueries = () => {
  const queryClient = useQueryClient();

  const assistantsQuery = useQuery({
    queryKey: ['custom-assistants'],
    queryFn: () => getAllAssistants(),
  });

  const useOllamaModelsQuery = (baseUrl: string) =>
    useQuery({
      queryKey: ['ollama-models', baseUrl],
      queryFn: () => fetch(`${baseUrl}/api/tags`).then((res) => res.json()),
      enabled: !!baseUrl,
    });

  const createAssistantMutation = useMutation({
    mutationFn: (assistant: Omit<TCustomAssistant, 'organizationId'>) =>
      createAssistant(assistant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-assistants'] });
      assistantsQuery.refetch();
    },
  });
  const updateAssistantMutation = useMutation({
    mutationFn: ({
      key,
      assistant,
    }: {
      key: string;
      assistant: Partial<Omit<TCustomAssistant, 'key'>>;
    }) => updateAssistant(key, assistant),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-assistants'] });
      assistantsQuery.refetch();
    },
  });

  const removeAssistantMutation = useMutation({
    mutationFn: async (key: string) => {
      await removeAssistant(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-assistants'] });
      assistantsQuery.refetch();
    },
  });

  const addAssistantsMutation = useMutation({
    mutationFn: (assistants: TCustomAssistant[]) => addAssistants(assistants),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-assistants'] });
      assistantsQuery.refetch();
    },
  });

  return {
    assistantsQuery,
    createAssistantMutation,
    updateAssistantMutation,
    removeAssistantMutation,
    addAssistantsMutation,
    useOllamaModelsQuery,
  };
};
