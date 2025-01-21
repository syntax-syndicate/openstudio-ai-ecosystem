'use server';
import type { TPrompt } from '@/types';
import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { and, eq, sql } from 'drizzle-orm';

// Get all prompts for the current organization
export async function getPrompts(): Promise<TPrompt[]> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return [];

  return database
    .select()
    .from(schema.prompts)
    .where(eq(schema.prompts.organizationId, organizationId));
}

// Create a new prompt
export async function createPrompt(
  prompt: Omit<TPrompt, 'id' | 'organizationId' | 'userId'>
) {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) throw new Error('Unauthorized');

  return database
    .insert(schema.prompts)
    .values({
      id: crypto.randomUUID(),
      name: prompt.name,
      content: prompt.content,
      organizationId,
      userId: user.id,
    })
    .returning();
}

// Update an existing prompt
export async function updatePrompt(
  id: string,
  prompt: Partial<Omit<TPrompt, 'id' | 'organizationId' | 'userId'>>
) {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) throw new Error('Unauthorized');

  return database
    .update(schema.prompts)
    .set({ name: prompt.name, content: prompt.content })
    .where(
      and(
        eq(schema.prompts.id, id),
        eq(schema.prompts.organizationId, organizationId)
      )
    )
    .returning();
}

// Delete a prompt
export async function deletePrompt(id: string) {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) throw new Error('Unauthorized');

  return database
    .delete(schema.prompts)
    .where(
      and(
        eq(schema.prompts.id, id),
        eq(schema.prompts.organizationId, organizationId)
      )
    );
}

// Add or update multiple prompts
export async function addPrompts(
  prompts: Omit<TPrompt, 'organizationId' | 'userId'>[]
): Promise<void> {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) throw new Error('Unauthorized');

  await database
    .insert(schema.prompts)
    .values(
      prompts.map((prompt) => ({
        ...prompt,
        organizationId,
        userId: user.id,
      }))
    )
    .onConflictDoUpdate({
      target: schema.prompts.id,
      set: {
        name: sql`excluded.name`,
        content: sql`excluded.content`,
        organizationId: sql`excluded.organization_id`,
        userId: sql`excluded.user_id`,
      },
    });
}

// Get a prompt by ID
export async function getPromptById(id: string): Promise<TPrompt | null> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return null;

  const result = await database
    .select()
    .from(schema.prompts)
    .where(
      and(
        eq(schema.prompts.id, id),
        eq(schema.prompts.organizationId, organizationId)
      )
    )
    .limit(1);

  return result[0] || null;
}
