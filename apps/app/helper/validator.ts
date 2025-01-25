import { schema } from '@repo/backend/schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const assistantSchema: z.ZodTypeAny = createSelectSchema(
  schema.assistants
);

export const promptSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
});

export const preferencesSchema: z.ZodTypeAny = createSelectSchema(
  schema.preferences,
  {
    defaultPlugins: z.array(z.string()),
    memories: z.array(z.string()),
  }
);

export const runConfigSchema = z.object({
  context: z.string().optional(),
  input: z.string().optional(),
  image: z.string().optional(),
  sessionId: z.string(),
  messageId: z.string().optional(),
  assistant: assistantSchema,
});

export type RunConfigProps = z.infer<typeof runConfigSchema>;

export const toolsSchema = z.array(
  z.object({
    toolName: z.string(),
    isLoading: z.boolean().default(false),
    executionArgs: z.any().optional(),
    executionResult: z.any().optional(),
    renderData: z.any().optional(),
  })
);

export const chatMessageSchema: z.ZodTypeAny = createSelectSchema(
  schema.chatMessages,
  {
    runConfig: runConfigSchema,
    tools: toolsSchema,
    relatedQuestions: z.array(z.string()).nullable(),
  }
);

export const apiKeysSchema: z.ZodTypeAny = createSelectSchema(schema.apiKeys);

export type ApiKeysProps = z.infer<typeof apiKeysSchema>;

export const chatSessionSchema: z.ZodTypeAny = createSelectSchema(
  schema.chatSessions
);

export const customAssistantSchema: z.ZodTypeAny = createSelectSchema(
  schema.customAssistants,
  {
    startMessage: z.array(z.string()).nullable(),
  }
);

export const dataValidator = z.object({
  preferences: preferencesSchema.optional(),
  apiKeys: z.array(apiKeysSchema).optional(),
  prompts: z.array(promptSchema).optional(),
  chatMessages: z.array(chatMessageSchema).optional(),
  chatSessions: z.array(chatSessionSchema).optional(),
  customAssistants: z.array(customAssistantSchema).optional(),
});

export const subscribeSchema = z.object({
  name: z.string().min(1).max(48),
  email: z.string().email(),
});

export const validUsernameRegex = new RegExp(/^[a-zA-Z0-9]+$/);
const notAllowedUsernames = ['app', 'go', 'www'];

export const updateUserSchema = z
  .object({
    name: z.string().min(1).max(48),
    username: z
      .string()
      .toLowerCase()
      .regex(validUsernameRegex, 'You can only use letters and numbers')
      .min(1)
      .max(36)
      .refine(
        (value) => !notAllowedUsernames.includes(value),
        'Username is not available'
      ),
    title: z.string().max(32).nullable(),
    about: z.string().max(400).nullable(),
    image: z.string().url().nullable(),
    email: z.string().email(),
    seoTitle: z.string().max(60).nullable(),
    seoDescription: z.string().max(160).nullable(),
    ogImage: z.string().url().nullable(),
    twitter: z.string().trim().nullable(),
    postscv: z.string().trim().nullable(),
    dribbble: z.string().trim().nullable(),
    github: z.string().trim().nullable(),
    linkedin: z.string().trim().nullable(),
    readcv: z.string().trim().nullable(),
    contactEmail: z.string().trim().nullable(),
  })
  .partial();
