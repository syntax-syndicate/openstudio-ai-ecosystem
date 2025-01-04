'use client';

import type { usePreferences } from '@/app/hooks/use-preferences';
import { createContext, useContext } from 'react';

export type TPreferenceContext = ReturnType<typeof usePreferences>;
export const PreferenceContext = createContext<undefined | TPreferenceContext>(
  undefined
);

export const usePreferenceContext = () => {
  const context = useContext(PreferenceContext);
  if (context === undefined) {
    throw new Error('usePreference must be used within a PreferencesProvider');
  }
  return context;
};
