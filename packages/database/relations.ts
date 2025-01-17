import { relations } from 'drizzle-orm/relations';
import { chatMessages, chatSessions } from './schema';

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chatSession: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

export const chatSessionsRelations = relations(chatSessions, ({ many }) => ({
  chatMessages: many(chatMessages),
}));
