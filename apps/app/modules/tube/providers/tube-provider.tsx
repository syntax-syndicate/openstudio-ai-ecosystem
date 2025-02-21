'use client';
import initHotjar from '@/lib/utils/hotjar';

import { createContext, useContext, useEffect, useState } from 'react';

export type TubeContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isMobileSidebarOpen: boolean) => void;
};
export const TubeContext = createContext<TubeContextType | null>(null);

export const TubeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initHotjar();
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  return (
    <TubeContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
      }}
    >
      {children}
    </TubeContext.Provider>
  );
};

export const useTubeContext = () => {
  const context = useContext(TubeContext);
  if (!context) {
    throw new Error('useTubeContext must be used within a TubeProvider');
  }
  return context;
};
