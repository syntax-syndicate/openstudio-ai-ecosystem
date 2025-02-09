import { z } from 'zod';
import { tb } from './client';

// First schema for OSA (Open Studio Analytics)
const tinybirdOSA = z.object({
  userId: z.string(),
  timestamp: z.string(), // ISO string timestamp
  domain: z.string(),
  page: z.string(),
  ip: z.string(),
  country: z.string(),
  city: z.string(),
  region: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  ua: z.string(),
  browser: z.string(),
  browser_version: z.string(),
  engine: z.string(),
  engine_version: z.string(),
  os: z.string(),
  os_version: z.string(),
  device: z.string(),
  device_vendor: z.string(),
  device_model: z.string(),
  cpu_architecture: z.string(),
  bot: z.string(),
  referer: z.string(),
  referer_url: z.string(),
});

export type TinybirdOSA = z.infer<typeof tinybirdOSA>;

export const publishOSA = tb.buildIngestEndpoint({
  datasource: 'osa',
  event: tinybirdOSA,
});

// Second schema for Bookmark Analytics
const tinybirdBookmarkAnalytics = z.object({
  timestamp: z.string(), // ISO string timestamp
  bookmarkId: z.string(),
  ip: z.string(),
  country: z.string(),
  city: z.string(),
  region: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  ua: z.string(),
  browser: z.string(),
  browser_version: z.string(),
  engine: z.string(),
  engine_version: z.string(),
  os: z.string(),
  os_version: z.string(),
  device: z.string(),
  device_vendor: z.string(),
  device_model: z.string(),
  cpu_architecture: z.string(),
  bot: z.string(),
  referer: z.string(),
  referer_url: z.string(),
});

export type TinybirdBookmarkAnalytics = z.infer<
  typeof tinybirdBookmarkAnalytics
>;

export const publishBookmarkAnalytics = tb.buildIngestEndpoint({
  datasource: 'osb',
  event: tinybirdBookmarkAnalytics,
});

const tinybirdAICall = z.object({
  userId: z.string(),
  organizationId: z.string(),
  userEmail: z.string(),
  timestamp: z.number(), //date
  totalTokens: z.number().int(),
  completionTokens: z.number().int(),
  promptTokens: z.number().int(),
  cost: z.number(),
  model: z.string(),
  provider: z.string(),
  label: z.string().optional(),
  data: z.string().optional(),
});

export type TinybirdAICall = z.infer<typeof tinybirdAICall>;

export const publishAICall = tb.buildIngestEndpoint({
  datasource: 'aiCall',
  event: tinybirdAICall,
});
