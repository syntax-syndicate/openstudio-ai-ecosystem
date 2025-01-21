'use server';
import type { TAssistant } from '@/types';
import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import type { TCustomAssistant } from '@repo/backend/types';
import { and, eq } from 'drizzle-orm';

// Get system-wide legacy assistants
export async function getLegacyAssistants(): Promise<TAssistant[]> {
  const assistants = await database.select().from(schema.assistants);
  return assistants || [];
}

// Create a new custom assistant
export async function createAssistant(
  assistant: Omit<TCustomAssistant, 'organizationId'>
): Promise<TCustomAssistant | null> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) throw new Error('No organization found');

  const newAssistant = await database
    .insert(schema.customAssistants)
    .values({
      ...assistant,
      organizationId,
    })
    .returning();
  return newAssistant?.[0] || null;
}

// Add multiple custom assistants
export async function addAssistants(
  assistants: Omit<TCustomAssistant, 'organizationId'>[]
): Promise<void> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) throw new Error('No organization found');

  await database.insert(schema.customAssistants).values(
    assistants.map((assistant) => ({
      ...assistant,
      organizationId,
    }))
  );
}

// Update an existing custom assistant
export async function updateAssistant(
  key: string,
  assistant: Partial<Omit<TCustomAssistant, 'key' | 'organizationId'>>
): Promise<TCustomAssistant | null> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) throw new Error('No organization found');

  const updatedAssistant = await database
    .update(schema.customAssistants)
    .set(assistant)
    .where(
      and(
        eq(schema.customAssistants.key, key),
        eq(schema.customAssistants.organizationId, organizationId)
      )
    )
    .returning();
  return updatedAssistant?.[0] || null;
}

// Get all custom assistants for the current organization
export async function getAllAssistants(): Promise<TCustomAssistant[]> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return [];

  const assistants = await database
    .select()
    .from(schema.customAssistants)
    .where(eq(schema.customAssistants.organizationId, organizationId));
  return assistants || [];
}

// Get a specific custom assistant by key
export async function getAssistantByKey(
  key: string
): Promise<TCustomAssistant | null> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return null;

  const assistant = await database
    .select()
    .from(schema.customAssistants)
    .where(
      and(
        eq(schema.customAssistants.key, key),
        eq(schema.customAssistants.organizationId, organizationId)
      )
    )
    .limit(1);
  return assistant?.[0] || null;
}

// Remove a custom assistant
export async function removeAssistant(key: string): Promise<void> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return;

  await database
    .delete(schema.customAssistants)
    .where(
      and(
        eq(schema.customAssistants.key, key),
        eq(schema.customAssistants.organizationId, organizationId)
      )
    );
}

// Helper function to verify assistant access
export async function verifyAssistantAccess(key: string): Promise<boolean> {
  const assistant = await getAssistantByKey(key);
  return !!assistant;
}
