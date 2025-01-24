'use server';

import { defaultPreferences } from '@/config';
import type { TApiKeyInsert, TApiKeys, TPreferences, TProvider } from '@/types';
import { currentOrganizationId } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { schema } from '@repo/backend/schema';
import { and, eq, sql } from 'drizzle-orm';

// Get all API keys for the current organization
export async function getApiKeys(): Promise<TApiKeys[]> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return [];

  const result = await database
    .select()
    .from(schema.apiKeys)
    .where(eq(schema.apiKeys.organizationId, organizationId));
  return result;
}

// Get preferences for the current organization
export async function getPreferences(): Promise<
  TPreferences | Omit<TPreferences, 'id' | 'organizationId'>
> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return defaultPreferences;

  const result = await database
    .select()
    .from(schema.preferences)
    .where(eq(schema.preferences.organizationId, organizationId))
    .limit(1);

  if (!result?.[0]) {
    // If no preferences exist for this organization, create default ones
    const newPreferences = await createDefaultPreferences(organizationId);
    return newPreferences || defaultPreferences;
  }

  return result[0];
}

// Create default preferences for an organization
async function createDefaultPreferences(
  organizationId: string
): Promise<TPreferences | null> {
  try {
    const result = await database
      .insert(schema.preferences)
      .values({
        ...defaultPreferences,
        organizationId,
        id: crypto.randomUUID(),
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Error creating default preferences', error);
    return null;
  }
}

// Update preferences for the current organization
export async function setPreferences(
  preferences: Partial<Omit<TPreferences, 'id' | 'organizationId'>>
): Promise<TPreferences | null> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) throw new Error('No organization found');

  const currentPreferences = await getPreferences();
  const newPreferences = { ...currentPreferences, ...preferences };

  const result = await database
    .update(schema.preferences)
    .set(preferences)
    .where(eq(schema.preferences.organizationId, organizationId))
    .returning();

  if (!result.length) {
    // If no preferences exist yet, create them
    return createDefaultPreferences(organizationId) || defaultPreferences;
  }

  return result[0];
}

// Reset preferences to defaults
export async function resetToDefaults(): Promise<void> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return;

  await database
    .update(schema.preferences)
    .set(defaultPreferences)
    .where(eq(schema.preferences.organizationId, organizationId));
}

// Set a single API key
export async function setApiKey(
  provider: TProvider,
  value: string
): Promise<void> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) throw new Error('No organization found');

  try {
    const existingKey = await getApiKey(provider);
    if (existingKey) {
      await database
        .update(schema.apiKeys)
        .set({ key: value })
        .where(
          and(
            eq(schema.apiKeys.provider, provider),
            eq(schema.apiKeys.organizationId, organizationId)
          )
        );
    } else {
      await database.insert(schema.apiKeys).values({
        id: crypto.randomUUID(),
        provider,
        key: value,
        organizationId,
      });
    }
  } catch (error) {
    console.error('Error setting API key', error);
  }
}

// Remove an API key
export async function removeApiKey(provider: TProvider): Promise<void> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return;

  await database
    .delete(schema.apiKeys)
    .where(
      and(
        eq(schema.apiKeys.provider, provider),
        eq(schema.apiKeys.organizationId, organizationId)
      )
    );
}

// Set multiple API keys at once
export async function setApiKeys(records: TApiKeyInsert[]): Promise<void> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return;

  try {
    await database
      .insert(schema.apiKeys)
      .values(
        records.map((record) => ({
          ...record,
          id: crypto.randomUUID(),
          organizationId,
        }))
      )
      .onConflictDoUpdate({
        target: [schema.apiKeys.provider, schema.apiKeys.organizationId],
        set: { key: sql`excluded.key` },
      });
  } catch (error) {
    console.error('Error setting API keys', error);
  }
}

// Get a single API key by provider
export async function getApiKey(
  provider: TProvider
): Promise<TApiKeys | undefined> {
  const organizationId = await currentOrganizationId();
  if (!organizationId) return undefined;

  const result = await database
    .select()
    .from(schema.apiKeys)
    .where(
      and(
        eq(schema.apiKeys.provider, provider),
        eq(schema.apiKeys.organizationId, organizationId)
      )
    )
    .limit(1);
  return result?.[0];
}
