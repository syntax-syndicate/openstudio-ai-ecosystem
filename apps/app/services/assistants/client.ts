import type { TAssistant } from '@/types';
import { database } from '@repo/database';
import { schema } from '@repo/database/schema';
import type { TCustomAssistant } from '@repo/database/types';
import { eq } from 'drizzle-orm';

export class AssistantService {
  async getLegacyAssistants(): Promise<TAssistant[]> {
    const assistants = await database.select().from(schema.assistants);
    return assistants || [];
  }

  async createAssistant(
    assistant: TCustomAssistant
  ): Promise<TCustomAssistant | null> {
    const newAssistant = await database
      .insert(schema.customAssistants)
      .values(assistant)
      .returning();
    return newAssistant?.[0] || null;
  }

  async addAssistants(assistants: TCustomAssistant[]): Promise<void> {
    await database.insert(schema.customAssistants).values(assistants);
  }

  async updateAssistant(
    key: string,
    assistant: Partial<Omit<TCustomAssistant, 'key'>>
  ): Promise<TCustomAssistant | null> {
    const updatedAssistant = await database
      .update(schema.customAssistants)
      .set(assistant)
      .where(eq(schema.customAssistants.key, key))
      .returning();
    return updatedAssistant?.[0] || null;
  }

  async getAllAssistant(): Promise<TCustomAssistant[]> {
    const assistants = await database.select().from(schema.customAssistants);
    return assistants || [];
  }

  async removeAssistant(key: string): Promise<void> {
    await database
      .delete(schema.customAssistants)
      .where(eq(schema.customAssistants.key, key));
  }
}

export const assistantService = new AssistantService();
