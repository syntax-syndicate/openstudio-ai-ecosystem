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

const tinybirdYoutubeCommentThread = z.object({
  id: z.string(),
  video_id: z.string(),
  channel_id: z.string(),
  organization_id: z.string(),
  author_display_name: z.string(),
  author_profile_image_url: z.string(),
  author_channel_url: z.string(),
  author_channel_id: z.string(),
  text_display: z.string(),
  text_original: z.string(),
  like_count: z.number().int(),
  published_at: z.string(), // ISO string timestamp
  updated_at: z.string(), // ISO string timestamp
  can_reply: z.number().int(), // UInt8 in Tinybird
  total_reply_count: z.number().int(),
  is_public: z.number().int(), // UInt8 in Tinybird
  moderation_status: z.string().optional(),
  is_processed: z.number().int().optional(), // UInt8 in Tinybird
  created_at: z.string(), // ISO string timestamp
  synced_at: z.string(), // ISO string timestamp
});

export type TinybirdYoutubeCommentThread = z.infer<
  typeof tinybirdYoutubeCommentThread
>;

export const publishYoutubeCommentThread = tb.buildIngestEndpoint({
  datasource: 'youtube_comment_threads',
  event: tinybirdYoutubeCommentThread,
});

// YouTube Comment Replies schema
const tinybirdYoutubeCommentReply = z.object({
  id: z.string(),
  parent_id: z.string(),
  video_id: z.string(),
  channel_id: z.string(),
  organization_id: z.string(),
  author_display_name: z.string(),
  author_profile_image_url: z.string(),
  author_channel_url: z.string(),
  author_channel_id: z.string(),
  text_display: z.string(),
  text_original: z.string(),
  like_count: z.number().int(),
  published_at: z.string(), // ISO string timestamp
  updated_at: z.string(), // ISO string timestamp
  moderation_status: z.string().optional(),
  is_processed: z.number().int().optional(), // UInt8 in Tinybird
  created_at: z.string(), // ISO string timestamp
  synced_at: z.string(), // ISO string timestamp
});

export type TinybirdYoutubeCommentReply = z.infer<
  typeof tinybirdYoutubeCommentReply
>;

export const publishYoutubeCommentReply = tb.buildIngestEndpoint({
  datasource: 'youtube_comment_replies',
  event: tinybirdYoutubeCommentReply,
});

// YouTube Comment Sync Metadata schema
const tinybirdYoutubeSyncMetadata = z.object({
  organization_id: z.string(),
  channel_id: z.string(),
  video_id: z.string().optional(),
  last_sync_time: z.string(), // ISO string timestamp
  oldest_comment_time: z.string().optional(), // ISO string timestamp
  newest_comment_time: z.string().optional(), // ISO string timestamp
  next_page_token: z.string().optional(),
  comments_synced: z.number().int(),
  sync_status: z.string(),
  error_message: z.string().optional(),
  created_at: z.string(), // ISO string timestamp
  updated_at: z.string(), // ISO string timestamp
});

export type TinybirdYoutubeSyncMetadata = z.infer<
  typeof tinybirdYoutubeSyncMetadata
>;

export const publishYoutubeSyncMetadata = tb.buildIngestEndpoint({
  datasource: 'youtube_comment_sync_metadata',
  event: tinybirdYoutubeSyncMetadata,
});
