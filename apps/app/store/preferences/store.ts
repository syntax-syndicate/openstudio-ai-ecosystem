import { defaultPreferences } from '@/config';
import type { TPreferences, TPreferencesState } from '@/types';
import { create } from 'zustand';

const initialState = {
  preferences: defaultPreferences,
  apiKeys: [] as { provider: string; key: string }[],
};
export const createPreferencesStore = () =>
  create<TPreferencesState>((set, get) => ({
    ...initialState,
    setPreferences: (preferences: Partial<TPreferences>) => {
      const existingPreferences = get().preferences;
      set({ preferences: { ...existingPreferences, ...preferences } });
    },
    setApiKeys: (apiKeys: { provider: string; key: string }[]) => {
      set({ apiKeys });
    },
  }));
