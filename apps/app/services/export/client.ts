'use server';

import { defaultPreferences } from '@/config';
import { dataValidator } from '@/helper/validator';
import {
  addAssistants,
  getAllAssistants,
  getLegacyAssistants,
} from '@/services/assistants/client';
import {
  getApiKeys,
  getPreferences,
  setApiKeys,
  setPreferences,
} from '@/services/preferences/client';
import { addPrompts } from '@/services/prompts/client';
import {
  addAllMessages,
  addSessions,
  getAllMessages,
  getSessions,
} from '@/services/sessions/client';
import type { ExportData } from '@/types/export';
import moment from 'moment';

// Process data export
export async function processExport(): Promise<ExportData> {
  try {
    const [
      chatSessions,
      allMessages,
      userPreferences,
      apiKeys,
      legacyAssistants,
      customAssistants,
    ] = await Promise.all([
      getSessions(),
      getAllMessages(),
      getPreferences(),
      getApiKeys(),
      getLegacyAssistants(),
      getAllAssistants(),
    ]);

    const exportData = {
      preferences: { ...defaultPreferences, ...userPreferences },
      apiKeys,
      chatMessages: allMessages,
      chatSessions: chatSessions.map((session) => ({
        ...session,
        isExample: session.isExample ?? false,
        customAssistant: session.customAssistant ?? null,
      })),
      customAssistants,
    };

    // Validate data before export
    await dataValidator.parseAsync(exportData);

    return exportData;
  } catch (error) {
    console.error('Error processing export:', error);
    throw error;
  }
}

// Process data import
export async function processImport(data: string): Promise<void> {
  try {
    const parsedData = dataValidator.parse(JSON.parse(data), {
      errorMap: (issue: any, ctx: any) => {
        return { message: ctx.defaultError };
      },
    });

    const {
      chatSessions,
      chatMessages,
      preferences: userPreferences,
      apiKeys,
      prompts: userPrompts,
      customAssistants,
    } = parsedData;

    // Process all imports in parallel
    await Promise.all([
      // Import sessions if they exist
      chatSessions &&
        addSessions(
          chatSessions.map((session) => ({
            ...session,
            title: session.title ?? null,
            customAssistant: session.customAssistant ?? null,
            createdAt: moment(session.createdAt).toDate(),
            updatedAt: moment(session.updatedAt).toDate(),
          }))
        ),

      // Import messages if they exist
      chatMessages && addAllMessages(chatMessages),

      // Import prompts if they exist
      userPrompts && addPrompts(userPrompts),

      // Import preferences if they exist
      userPreferences && setPreferences(userPreferences),

      // Import API keys if they exist
      apiKeys && setApiKeys(apiKeys),

      // Import custom assistants if they exist
      customAssistants && addAssistants(customAssistants),
    ]);
  } catch (error) {
    console.error('Error processing import:', error);
    throw error;
  }
}
