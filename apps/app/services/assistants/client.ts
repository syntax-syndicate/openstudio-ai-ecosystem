import { generateShortUUID } from '@/helper/utils';
import type { TAssistant } from '@/types';
import { database } from '@repo/database';
import { schema } from '@repo/database/schema';
import { eq, sql } from 'drizzle-orm';

export class AssistantService {
  async getAssistants(): Promise<TAssistant[]> {
    const assistants = await database.select().from(schema.assistants);
    return assistants || [];
  }

  async createAssistant(assistant: Omit<TAssistant, 'key'>) {
    const newAssistant = { ...assistant, key: generateShortUUID() };
    await database
      .insert(schema.assistants)
      .values(newAssistant)
      .onConflictDoUpdate({
        target: schema.assistants.key,
        set: {
          ...newAssistant,
        },
      });
  }

  async deleteAssistant(key: string) {
    await database
      .delete(schema.assistants)
      .where(eq(schema.assistants.key, key));
  }

  async updateAssistant(
    assistantKey: string,
    newAssistant: Omit<TAssistant, 'key'>
  ) {
    await database
      .update(schema.assistants)
      .set(newAssistant)
      .where(eq(schema.assistants.key, assistantKey));
  }

  async addAssistants(assistants: TAssistant[]) {
    await database
      .insert(schema.assistants)
      .values(assistants)
      .onConflictDoUpdate({
        target: schema.assistants.key,
        set: {
          name: sql`excluded.name`,
          description: sql`excluded.description`,
          baseModel: sql`excluded.baseModel`,
          provider: sql`excluded.provider`,
          systemPrompt: sql`excluded.systemPrompt`,
          type: sql`excluded.type`,
          iconURL: sql`excluded.iconURL`,
        },
      });
  }
}

export const assistantService = new AssistantService();
