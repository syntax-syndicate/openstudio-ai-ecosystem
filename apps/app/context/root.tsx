'use client';
import initHotjar from '@/lib/utils/hotjar';

import { createContext, useEffect } from 'react';

export const RootContext = createContext({});

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initHotjar();
  }, []);
  return <RootContext.Provider value={{}}>{children}</RootContext.Provider>;
};
