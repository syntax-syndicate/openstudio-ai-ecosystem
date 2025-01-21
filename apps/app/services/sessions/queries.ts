import {
  addAssistantToSession,
  addMessage,
  addSessions,
  clearSessions,
  createNewSession,
  getMessages,
  getSessionById,
  getSessions,
  removeAssistantFromSession,
  removeMessage,
  removeSessionById,
  setSession,
  updateSession,
} from '@/services/sessions/client';
import type { TChatMessage, TChatSession } from '@/types';
import type { TCustomAssistant } from '@repo/backend/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useChatSessionQueries = () => {
  const sessionsQuery = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: () => getSessions(),
  });
  const setSessionMutation = useMutation({
    mutationFn: async (session: TChatSession) => await setSession(session),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const addMessageMutation = useMutation({
    mutationFn: async ({
      parentId,
      message,
    }: {
      parentId: string;
      message: TChatMessage;
    }) => {
      await addMessage(parentId, message);
      const newMessages = await getMessages(parentId);
      return newMessages;
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const updateSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      session,
    }: {
      sessionId: string;
      session: Partial<Omit<TChatSession, 'id'>>;
    }) => {
      await updateSession(sessionId, session);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const removeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => await removeSessionById(sessionId),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const useGetSessionByIdQuery = (id: string) =>
    useQuery({
      queryKey: ['chat-session', id],
      queryFn: async () => {
        if (!id) return;
        return await getSessionById(id);
      },
      enabled: !!id,
    });
  const useMessagesQuery = (id: string) =>
    useQuery({
      queryKey: ['messages', id],
      queryFn: () => getMessages(id),
      enabled: !!id,
    });
  const createNewSessionMutation = useMutation({
    mutationFn: async () => await createNewSession(),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const clearSessionsMutation = useMutation({
    mutationFn: async () => await clearSessions(),
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const removeMessageByIdMutation = useMutation({
    mutationFn: async ({
      parentId,
      messageId,
    }: {
      parentId: string;
      messageId: string;
    }) => {
      const leftMessages = await removeMessage(parentId, messageId);
      if (!leftMessages?.length) {
        await removeSessionById(parentId);
      }
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const addSessionsMutation = useMutation({
    mutationFn: async (sessions: TChatSession[]) => {
      return await addSessions(sessions);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  const addAssistantToSessionMutation = useMutation({
    mutationFn: async (assistant: TCustomAssistant) => {
      return await addAssistantToSession(assistant);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });
  const removeAssistantFromSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await removeAssistantFromSession(sessionId);
    },
    onSuccess: () => {
      sessionsQuery.refetch();
    },
  });

  return {
    sessionsQuery,
    setSessionMutation,
    addMessageMutation,
    updateSessionMutation,
    removeSessionMutation,
    useGetSessionByIdQuery,
    createNewSessionMutation,
    clearSessionsMutation,
    removeMessageByIdMutation,
    addSessionsMutation,
    useMessagesQuery,
    addAssistantToSessionMutation,
    removeAssistantFromSessionMutation,
  };
};
