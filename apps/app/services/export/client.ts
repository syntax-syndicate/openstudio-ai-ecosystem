import { defaultPreferences } from '@/config';
import { dataValidator } from '@/helper/validator';
import { AssistantService } from '@/services/assistants';
import { PreferenceService } from '@/services/preferences';
import { PromptsService } from '@/services/prompts';
import { MessagesService, SessionsService } from '@/services/sessions/client';
import type { ExportData } from '@/types/export';
import moment from 'moment';

export class ExportService {
  private messagesService: MessagesService;
  private sessionsService: SessionsService;
  private preferencesService: PreferenceService;
  private assistantsService: AssistantService;
  private promptsService: PromptsService;

  constructor(
    messagesService: MessagesService,
    sessionsService: SessionsService,
    preferencesService: PreferenceService,
    assistantsService: AssistantService,
    promptsService: PromptsService
  ) {
    this.messagesService = messagesService;
    this.sessionsService = sessionsService;
    this.preferencesService = preferencesService;
    this.assistantsService = assistantsService;
    this.promptsService = promptsService;
  }

  async processExport(): Promise<ExportData> {
    try {
      const chatSessions = await this.sessionsService.getSessions();
      const messages = (await this.messagesService.getAllMessages()) || [];

      const preferences = await this.preferencesService.getPreferences();
      const apiKeys = await this.preferencesService.getApiKeys();
      const assistants = await this.assistantsService.getAssistants();

      dataValidator.parseAsync({
        preferences: { ...defaultPreferences, ...preferences },
        apiKeys,
        chatMessages: messages,
        chatSessions,
        assistants,
      });

      return {
        preferences: { ...defaultPreferences, ...preferences },
        apiKeys,
        chatMessages: messages,
        chatSessions: chatSessions.map((session) => ({
          ...session,
          isExample: session.isExample ?? false,
        })),
        assistants,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async processImport(data: string) {
    try {
      const parsedData = dataValidator.parse(JSON.parse(data), {
        errorMap: (issue: any, ctx: any) => {
          return { message: ctx.defaultError };
        },
      });
      const sessions = parsedData.chatSessions;
      const messages = parsedData.chatMessages;
      const preferences = parsedData.preferences;
      const apiKeys = parsedData.apiKeys;
      const assistants = parsedData.assistants;
      const prompts = parsedData.prompts;

      sessions &&
        (await sessionsService.addSessions(
          sessions?.map((session) => ({
            ...session,
            title: session.title ?? null,
            createdAt: moment(session.createdAt).toDate(),
            updatedAt: moment(session.updatedAt).toDate(),
          }))
        ));
      messages && (await this.messagesService.addAllMessages(messages));
      prompts && (await this.promptsService.addPrompts(prompts));
      preferences && (await preferencesService.setPreferences(preferences));
      apiKeys && (await preferencesService.setApiKeys(apiKeys));

      assistants && (await assistantsService.addAssistants(assistants));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const messagesService = new MessagesService();
const sessionsService = new SessionsService(messagesService);
const preferencesService = new PreferenceService();
const assistantsService = new AssistantService();
const promptsService = new PromptsService();

export const exportService = new ExportService(
  messagesService,
  sessionsService,
  preferencesService,
  assistantsService,
  promptsService
);
