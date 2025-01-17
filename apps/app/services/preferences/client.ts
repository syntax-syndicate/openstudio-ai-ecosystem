import { defaultPreferences } from '@/config';
import type { TApiKeyInsert, TApiKeys, TPreferences, TProvider } from '@/types';
import { database } from '@repo/database';
import { schema } from '@repo/database/schema';
import { eq, sql } from 'drizzle-orm';

export class PreferenceService {
  async getApiKeys(): Promise<TApiKeys[]> {
    const result = await database.select().from(schema.apiKeys);
    return result;
  }

  async getPreferences(): Promise<TPreferences> {
    const result = await database.select().from(schema.preferences).limit(1);
    console.log('result', result);
    return result?.[0] || defaultPreferences;
  }

  async setPreferences(
    preferences: Partial<Omit<TPreferences, 'id'>>
  ): Promise<TPreferences> {
    const currentPreferences = await this.getPreferences();
    const newPreferences = { ...currentPreferences, ...preferences };
    await database
      ?.insert(schema.preferences)
      .values(newPreferences)
      .onConflictDoUpdate({
        target: schema.preferences.id,
        set: newPreferences,
      });
    return newPreferences;
  }

  async resetToDefaults(): Promise<void> {
    await database
      ?.insert(schema.preferences)
      .values(defaultPreferences)
      .onConflictDoUpdate({
        target: schema.preferences.id,
        set: defaultPreferences,
      });
  }

  async setApiKey(provider: TProvider, value: string): Promise<void> {
    try {
      const existingKey = await this.getApiKey(provider);
      if (existingKey) {
        await database
          ?.update(schema.apiKeys)
          .set({ key: value })
          .where(eq(schema.apiKeys.provider, provider));
      } else {
        await database.insert(schema.apiKeys).values({ provider, key: value });
      }
    } catch (error) {
      console.error('Error setting API key', error);
    }
  }

  async removeApiKey(provider: TProvider): Promise<void> {
    await database
      ?.delete(schema.apiKeys)
      .where(eq(schema.apiKeys.provider, provider));
  }

  async setApiKeys(records: TApiKeyInsert[]): Promise<void> {
    try {
      await database
        ?.insert(schema.apiKeys)
        .values(records)
        .onConflictDoUpdate({
          target: schema.apiKeys.provider,
          set: { key: sql`excluded.key` },
        });
    } catch (error) {
      console.error('Error setting API keys', error);
    }
  }

  async getApiKey(provider: TProvider): Promise<TApiKeys | undefined> {
    const result = await database
      ?.select()
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.provider, provider))
      .limit(1);
    return result?.[0];
  }
}

export const preferencesService = new PreferenceService();
