'use client';

import { PreferenceContext } from '@/app/context/preferences/context';
import { usePreferences } from '@/app/hooks/use-preferences';

export type TPreferencesProvider = {
  children: React.ReactNode;
};

export const PreferenceProvider = ({ children }: TPreferencesProvider) => {
  const preferences = usePreferences();
  return (
    <PreferenceContext.Provider value={preferences}>
      {children}
    </PreferenceContext.Provider>
  );
};
