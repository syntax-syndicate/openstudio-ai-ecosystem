import { generateShortUUID } from '@/helper/utils';
import type { TPrompt } from '@/types';
import { database } from '@repo/database';
import { schema } from '@repo/database/schema';
import { eq, sql } from 'drizzle-orm';

export class PromptsService {
  async getPrompts(): Promise<TPrompt[]> {
    const prompts = await database.select().from(schema.prompts);
    return prompts || [];
  }

  async createPrompt(prompt: Omit<TPrompt, 'id'>): Promise<void> {
    const newPrompt = { ...prompt, id: generateShortUUID() };
    console.log('newPrompt', newPrompt);
    const result = await database.insert(schema.prompts).values(newPrompt);
    console.log('result', result);
  }

  async updatePrompt(
    id: string,
    prompt: Partial<Omit<TPrompt, 'id'>>
  ): Promise<void> {
    await database
      .update(schema.prompts)
      .set(prompt)
      .where(eq(schema.prompts.id, id));
  }

  async deletePrompt(id: string): Promise<void> {
    await database.delete(schema.prompts).where(eq(schema.prompts.id, id));
  }

  async addPrompts(prompts: TPrompt[]): Promise<void> {
    await database
      .insert(schema.prompts)
      .values(prompts)
      .onConflictDoUpdate({
        target: schema.prompts.id,
        set: {
          name: sql`excluded.name`,
          content: sql`excluded.content`,
        },
      });
  }
}

export const promptsService = new PromptsService();
