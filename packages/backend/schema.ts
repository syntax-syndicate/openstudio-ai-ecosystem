import { init } from '@paralleldrive/cuid2';
import { type InferSelectModel, sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  foreignKey,
  index,
  integer,
  json,
  pgEnum,
  pgSchema,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import type { z } from 'zod';
import {
  type TCustomAssistant,
  type TLLMRunConfig,
  type ToolExecutionState,
  type ToolKey,
  providers,
} from './types';

const authSchema = pgSchema('auth');

export const Users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const organization = pgTable('organization', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 191 }).notNull(),
  logoUrl: varchar('logoUrl', { length: 191 }),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 6 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 6 })
    .defaultNow()
    .notNull(),
  productDescription: text('productDescription'),
  slug: varchar('slug', { length: 191 }).notNull(),
});

export const premiumTierEnum = pgEnum('premium_tier', [
  'PRO_MONTHLY',
  'PRO_ANNUALLY',
  'LIFETIME',
]);

export const premium = pgTable(
  'premium',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('userId').references(() => Users.id),
    organizationId: varchar('organizationId').references(() => organization.id),
    tier: premiumTierEnum('tier').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date', precision: 6 })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date', precision: 6 })
      .defaultNow()
      .notNull(),
    lemon_squeezy_renews_at: timestamp('lemon_squeezy_renews_at', {
      mode: 'date',
      precision: 6,
    }),
    lemon_squeezy_customer_id: integer('lemon_squeezy_customer_id'),
    lemon_squeezy_subscription_id: integer('lemon_squeezy_subscription_id'),
    lemon_squeezy_subscription_item_id: integer(
      'lemon_squeezy_subscription_item_id'
    ),
    lemon_squeezy_order_id: integer('lemon_squeezy_order_id'),
    lemon_squeezy_product_id: integer('lemon_squeezy_product_id'),
    lemon_squeezy_variant_id: integer('lemon_squeezy_variant_id'),
  },
  (table) => ({
    organizationIdIdx: index('premium_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const assistantTypeEnum = pgEnum('assistant_type', [
  'base',
  'custom',
] as const);
export const dalleImageQualityEnum = pgEnum('dalle_image_quality', [
  'standard',
  'hd',
] as const);
export const dalleImageSizeEnum = pgEnum('dalle_image_size', [
  '1024x1024',
  '1792x1024',
  '1024x1792',
] as const);
export const webSearchEngineEnum = pgEnum('web_search_engine', [
  'google',
  'duckduckgo',
] as const);
export const stopReasonEnum = pgEnum('stop_reason', [
  'error',
  'cancel',
  'apikey',
  'recursion',
  'finish',
  'unauthorized',
] as const);

export const providerEnum = pgEnum('provider', providers);

export const prompts = pgTable(
  'prompts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    content: text('content').notNull(),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id),
  },
  (table) => {
    return {
      organizationIdIdx: index('prompts_organization_id_idx').on(
        table.organizationId
      ),
      userIdIdx: index('prompts_user_id_idx').on(table.userId),
    };
  }
);

// TODO: later deprecate this table
export const chatSessions = pgTable(
  'chat_sessions',
  {
    id: text('id').primaryKey(),
    title: text('title'),
    isExample: boolean('is_example').default(false),
    customAssistant: json('custom_assistant').$type<TCustomAssistant>(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => Users.id, { onDelete: 'cascade' }), // References Supabase auth.users table
  },
  (table) => {
    return {
      organizationIdIdx: index('chat_sessions_organization_id_idx').on(
        table.organizationId
      ),
      userIdIdx: index('chat_sessions_user_id_idx').on(table.userId),
    };
  }
);

// TODO: later deprecate this table
export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  sessionId: varchar('session_id')
    .notNull()
    .references(() => chatSessions.id),
  parentId: varchar('parent_id'),
  image: text('image'),
  rawHuman: text('raw_human'),
  rawAI: text('raw_ai'),
  isLoading: boolean('is_loading').default(false),
  stop: boolean('stop').default(false),
  stopReason: stopReasonEnum('stop_reason'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  runConfig: json('run_config').$type<TLLMRunConfig>().notNull(),
  tools: json('tools').$type<ToolExecutionState[]>(),
  relatedQuestions: json('related_questions').$type<string[]>(),
});

export const chat = pgTable('chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => Users.id),
  organizationId: varchar('organizationId')
    .notNull()
    .references(() => organization.id),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable('message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  createdAt: timestamp('createdAt').notNull(),
  content: json('content').notNull(),
  role: varchar('role').notNull(),
  runConfig: json('runConfig').notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  'vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const assistants = pgTable('assistants', {
  name: text('name').notNull(),
  description: text('description'),
  systemPrompt: text('system_prompt').notNull(),
  iconURL: text('icon_url'),
  provider: providerEnum('provider').notNull(),
  baseModel: text('base_model').notNull(),
  key: text('key').unique().primaryKey(),
  type: assistantTypeEnum('type').notNull(),
});

export const customAssistants = pgTable('custom_assistants', {
  name: text('name').notNull(),
  description: text('description'),
  systemPrompt: text('system_prompt').notNull(),
  iconURL: text('icon_url'),
  key: text('key').unique().primaryKey(),
  startMessage: json('start_message').$type<string[]>(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id),
});

export const preferences = pgTable('preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: varchar('organization_id')
    .notNull()
    .unique()
    .references(() => organization.id),
  defaultAssistant: text('default_assistant').notNull(),
  systemPrompt: text('system_prompt').notNull(),
  messageLimit: integer('message_limit').notNull(),
  temperature: decimal('temperature').notNull(),
  memories: json('memories').$type<string[]>().notNull(),
  suggestRelatedQuestions: boolean('suggest_related_questions').notNull(),
  generateTitle: boolean('generate_title').notNull(),
  defaultPlugins: json('default_plugins').$type<ToolKey[]>().notNull(),
  whisperSpeechToTextEnabled: boolean(
    'whisper_speech_to_text_enabled'
  ).notNull(),
  dalleImageQuality: dalleImageQualityEnum('dalle_image_quality').notNull(),
  dalleImageSize: dalleImageSizeEnum('dalle_image_size').notNull(),
  maxTokens: integer('max_tokens').notNull(),
  defaultWebSearchEngine: webSearchEngineEnum(
    'default_web_search_engine'
  ).notNull(),
  ollamaBaseUrl: text('ollama_base_url').notNull(),
  topP: decimal('top_p').notNull(),
  topK: decimal('top_k').notNull(),
  googleSearchEngineId: text('google_search_engine_id'),
  googleSearchApiKey: text('google_search_api_key'),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  provider: text('provider').notNull(),
  key: text('key').notNull(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const changelogs = pgTable('changelogs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  images: text('images').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const feedbackTypeEnum = pgEnum('feedback_type', [
  'positive',
  'neutral',
  'negative',
]);

export const feedbacks = pgTable('feedbacks', {
  id: uuid('id').primaryKey().defaultRandom(),
  feedback: text('feedback').notNull(),
  feedbackType: feedbackTypeEnum('feedback_type')
    .$type<(typeof feedbackTypeEnum.enumValues)[number]>()
    .notNull(),
  email: varchar('email', { length: 320 }),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id),
  userId: varchar('user_id').references(() => Users.id),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const subscribers = pgTable(
  'subscribers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email').notNull(),
    name: varchar('name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id),
  },
  (table) => ({
    userIdIdx: index('subscribers_user_id_idx').on(table.userId),
  })
);

const createId = init({ length: 64, fingerprint: 'random-text' });

export const articles = pgTable(
  'articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull(),
    content: text('content'),
    published: boolean('published').default(false),
    slug: varchar('slug', { length: 64 })
      .$defaultFn(() => createId())
      .notNull(),
    views: integer('views').default(0),
    lastNewsletterSentAt: timestamp('last_newsletter_sent_at'),
    seoTitle: varchar('seo_title'),
    seoDescription: varchar('seo_description'),
    ogImage: varchar('og_image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    publishedAt: timestamp('published_at').defaultNow().notNull(),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id),
    canonicalURL: varchar('canonical_url'),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
  },
  (table) => ({
    authorSlugUnique: uniqueIndex('articles_author_id_slug_unique').on(
      table.authorId,
      table.slug
    ),
    organizationIdIdx: index('articles_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull(),
    content: text('content'),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    slug: text('slug').notNull(),
    views: integer('views').default(0),
    year: integer('year'),
    description: text('description'),
    url: varchar('url'),
    seoTitle: varchar('seo_title'),
    seoDescription: varchar('seo_description'),
    ogImage: varchar('og_image'),
    password: varchar('password'),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
  },
  (table) => ({
    authorSlugUnique: uniqueIndex('projects_author_id_slug_unique').on(
      table.authorId,
      table.slug
    ),
    organizationIdIdx: index('projects_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const collections = pgTable(
  'collections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name').notNull(),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
  },
  (table) => ({
    organizationIdIdx: index('collections_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title').notNull(),
    url: varchar('url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    authorId: varchar('author_id')
      .notNull()
      .references(() => Users.id),
    clicks: integer('clicks').default(0),
    collectionId: uuid('collection_id').references(() => collections.id),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
  },
  (table) => ({
    organizationIdIdx: index('bookmarks_organization_id_idx').on(
      table.organizationId
    ),
  })
);

export const integrationStatePlatform = pgEnum('integration_state_platform', [
  'YOUTUBE',
  'LINKEDIN',
  'TWITTER',
]);

export const integrationStates = pgTable('integration_state', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  creatorId: varchar('creator_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),
  platform: integrationStatePlatform('platform').notNull(),
});

// YouTube installation table
export const youtubeIntegration = pgTable('youtube_integration', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  organizationId: varchar('organization_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  creatorId: varchar('creator_id')
    .notNull()
    .references(() => Users.id, { onDelete: 'cascade' }),

  // OAuth related fields
  accessToken: varchar('access_token').notNull(),
  refreshToken: varchar('refresh_token').notNull(),
  tokenType: varchar('token_type').notNull(),
  scope: varchar('scope').notNull(),
  expiryDate: timestamp('expiry_date', { withTimezone: true }).notNull(),
});

export const integrationStateRelations = relations(
  integrationStates,
  ({ one }) => ({
    organization: one(organization, {
      fields: [integrationStates.organizationId],
      references: [organization.id],
    }),
  })
);

export const youtubeInstallationRelations = relations(
  youtubeIntegration,
  ({ one }) => ({
    organization: one(organization, {
      fields: [youtubeIntegration.organizationId],
      references: [organization.id],
    }),
  })
);

export const document = pgTable(
  'document',
  {
    id: uuid('id').notNull().defaultRandom(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    title: text('title').notNull(),
    content: text('content'),
    kind: varchar('text', { enum: ['text', 'code', 'image', 'sheet'] })
      .notNull()
      .default('text'),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  'suggestion',
  {
    id: uuid('id').notNull().defaultRandom(),
    documentId: uuid('document_id').notNull(),
    documentCreatedAt: timestamp('document_created_at').notNull(),
    originalText: text('original_text').notNull(),
    suggestedText: text('suggested_text').notNull(),
    description: text('description'),
    isResolved: boolean('is_resolved').notNull().default(false),
    organizationId: varchar('organization_id')
      .notNull()
      .references(() => organization.id),
    userId: varchar('user_id')
      .notNull()
      .references(() => Users.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const youtubeIntegrationInsertSchema: z.ZodTypeAny =
  createInsertSchema(youtubeIntegration);

export const organizationUpdateSchema: z.ZodTypeAny =
  createUpdateSchema(organization);

export const schema = {
  organization,
  organizationUpdateSchema,
  apiKeys,
  assistants,
  chatMessages,
  chatSessions,
  preferences,
  prompts,
  feedbacks,
  changelogs,
  customAssistants,
  collections,
  bookmarks,
  projects,
  articles,
  subscribers,
  premium,
  integrationStates,
  youtubeIntegration,
  document,
  suggestion,
};
