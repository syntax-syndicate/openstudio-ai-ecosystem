'use server';

import { generateShortUUID, sortSessions } from '@/helper/utils';
import type { TChatMessage, TChatSession } from '@/types';
import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import type { TCustomAssistant } from '@repo/backend/types';
import { and, asc, eq } from 'drizzle-orm';
import moment from 'moment';

// Message-related functions
export async function getAllMessages(): Promise<TChatMessage[]> {
  return database
    ?.select()
    .from(schema.chatMessages)
    .orderBy(asc(schema.chatMessages.createdAt));
}

export async function addAllMessages(messages: TChatMessage[]): Promise<void> {
  await database?.insert(schema.chatMessages).values(messages);
}

export async function getMessages(parentId: string): Promise<TChatMessage[]> {
  return (
    (await database
      ?.select()
      .from(schema.chatMessages)
      .where(eq(schema.chatMessages.parentId, parentId))
      .orderBy(asc(schema.chatMessages.createdAt))) || []
  );
}

export async function setMessages(
  parentId: string,
  messages: TChatMessage[]
): Promise<void> {
  await database?.insert(schema.chatMessages).values(
    messages?.map((message) => ({
      ...message,
      parentId,
      sessionId: parentId,
    }))
  );
}

export async function addMessage(
  parentId: string,
  chatMessage: TChatMessage
): Promise<void> {
  await database
    ?.insert(schema.chatMessages)
    .values({
      ...chatMessage,
      parentId,
      sessionId: parentId,
    })
    .onConflictDoUpdate({
      target: schema.chatMessages.id,
      set: chatMessage,
    });
}

export async function addMessages(
  parentId: string,
  messages: TChatMessage[]
): Promise<void> {
  await database?.insert(schema.chatMessages).values(
    messages?.map((message) => ({
      ...message,
      parentId,
      sessionId: parentId,
    }))
  );
}

export async function removeMessage(
  parentId: string,
  messageId: string
): Promise<TChatMessage[]> {
  await database
    ?.delete(schema.chatMessages)
    .where(eq(schema.chatMessages.id, messageId));
  return getMessages(parentId);
}

export async function removeMessages(parentId: string): Promise<void> {
  await database
    ?.delete(schema.chatMessages)
    .where(eq(schema.chatMessages.parentId, parentId));
}

// Session-related functions
export async function getSessions(): Promise<TChatSession[]> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) {
    return [];
  }

  return (
    database
      .select()
      .from(schema.chatSessions)
      .where(
        and(
          eq(schema.chatSessions.organizationId, organizationId),
          eq(schema.chatSessions.userId, user.id)
        )
      ) || []
  );
}

export async function setSession(
  chatSession: Omit<TChatSession, 'organizationId' | 'userId'>
): Promise<void> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();
  if (!organizationId || !user) throw new Error('Unauthorized');

  await database.insert(schema.chatSessions).values({
    ...chatSession,
    organizationId,
    userId: user.id,
  });
}

export async function addAssistantToSession(
  assistant: TCustomAssistant
): Promise<TChatSession | null> {
  const newSession = await createNewSession();
  if (!newSession) return null;

  const updatedSession = await database
    ?.update(schema.chatSessions)
    .set({
      customAssistant: assistant,
    })
    .where(eq(schema.chatSessions.id, newSession.id))
    .returning();
  return updatedSession?.[0] || null;
}

export async function removeAssistantFromSession(
  sessionId: string
): Promise<TChatSession | null> {
  const session = await getSessionById(sessionId);
  if (!session) return null;

  const latestSessionMessages = await getMessages(sessionId);
  if (latestSessionMessages?.length) return null;

  const updatedSession = await database
    ?.update(schema.chatSessions)
    .set({
      customAssistant: null,
    })
    .where(eq(schema.chatSessions.id, sessionId))
    .returning();
  return updatedSession?.[0] || null;
}

export async function updateSession(
  sessionId: string,
  newSession: Partial<Omit<TChatSession, 'id' | 'organizationId' | 'userId'>>
): Promise<void> {
  const session = await getSessionById(sessionId);
  if (!session) return;

  await database
    .update(schema.chatSessions)
    .set(newSession)
    .where(eq(schema.chatSessions.id, sessionId));
}

export async function getSessionById(id: string): Promise<TChatSession | null> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) return null;

  const session = await database
    ?.select()
    .from(schema.chatSessions)
    .where(
      and(
        eq(schema.chatSessions.id, id),
        eq(schema.chatSessions.organizationId, organizationId),
        eq(schema.chatSessions.userId, user.id)
      )
    )
    .limit(1);
  return session?.[0] || null;
}

export async function removeSessionById(
  id: string
): Promise<TChatSession | null> {
  try {
    const session = await getSessionById(id);
    if (!session) return null;

    await removeMessages(id);
    await database
      ?.delete(schema.chatSessions)
      .where(eq(schema.chatSessions.id, id));

    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createNewSession(): Promise<TChatSession | null> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) return null;

  const sessions = await getSessions();
  const latestSession = sortSessions(sessions, 'createdAt')?.[0];
  const latestSessionMessages = await getMessages(latestSession?.id);

  if (latestSession && latestSessionMessages?.length === 0) {
    return latestSession;
  }

  const newSession = await database
    ?.insert(schema.chatSessions)
    .values({
      id: generateShortUUID(),
      title: 'Untitled',
      createdAt: moment().toDate(),
      organizationId,
      userId: user.id,
    })
    .returning();

  return newSession?.[0] || null;
}

export async function clearSessions(): Promise<void> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) return;

  await database?.delete(schema.chatMessages).where(
    eq(
      schema.chatMessages.sessionId,
      database
        .select({ id: schema.chatSessions.id })
        .from(schema.chatSessions)
        .where(
          and(
            eq(schema.chatSessions.organizationId, organizationId),
            eq(schema.chatSessions.userId, user.id)
          )
        )
    )
  );

  await database
    ?.delete(schema.chatSessions)
    .where(
      and(
        eq(schema.chatSessions.organizationId, organizationId),
        eq(schema.chatSessions.userId, user.id)
      )
    );
}

export async function addSessions(
  sessions: Omit<TChatSession[], 'organizationId' | 'userId'>
): Promise<void> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) return;

  await database?.insert(schema.chatSessions).values(
    sessions.map((session) => ({
      ...session,
      organizationId,
      userId: user.id,
    }))
  );
}
