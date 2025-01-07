import type { useChatSessionQueries } from '@/services/sessions/queries';
import type { TChatMessage } from '@/types';

export type TChatSession = {
  title?: string;
  id: string;
  createdAt: string;
  updatedAt?: string;
};
export type TSessionsProvider = {
  children: React.ReactNode;
};
export type TSessionsContext = {
  sessions: TChatSession[];
  isAllSessionLoading: boolean;
  createSession: (props: { redirect?: boolean }) => void;
  refetchSessions?: () => void;
  addMessage: (parentId: string, message: TChatMessage) => void;
} & ReturnType<typeof useChatSessionQueries>;
