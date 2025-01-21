import type { TPreferences } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getApiKeys,
  getPreferences,
  resetToDefaults,
  setApiKey,
  setPreferences,
} from './client';

export const usePreferencesQueries = () => {
  const preferencesQuery = useQuery({
    queryKey: ['preferences'],
    queryFn: () => getPreferences(),
  });
  const apiKeysQuery = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => getApiKeys(),
  });
  const setPreferencesMutation = useMutation({
    mutationFn: async (preferences: Partial<TPreferences>) =>
      await setPreferences(preferences),
    onSuccess() {
      preferencesQuery.refetch();
    },
  });
  const setApiKeyMutation = useMutation({
    mutationFn: async ({ key, value }: any) => await setApiKey(key, value),
    onSuccess: () => {
      apiKeysQuery.refetch();
    },
  });
  const resetToDefaultsMutation = useMutation({
    mutationFn: () => resetToDefaults(),
    onSuccess: () => {
      preferencesQuery.refetch();
    },
  });
  return {
    preferencesQuery,
    setPreferencesMutation,
    resetToDefaultsMutation,
    setApiKeyMutation,
    apiKeysQuery,
  };
};
