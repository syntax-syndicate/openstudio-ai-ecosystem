import { z } from 'zod';
import { tb } from './client';

export const getCountPerModel = tb.buildPipe({
  pipe: 'count_per_model_pipe',
  parameters: z.object({
    userEmail: z.string().email(),
    model: z.string(),
  }),
  data: z.object({
    model: z.string(),
    count: z.number(),
  }),
});

export const getCountPerUser = tb.buildPipe({
  pipe: 'count_per_user_pipe',
  parameters: z.object({
    userEmail: z.string().email(),
  }),
  data: z.object({
    count: z.number(),
  }),
});

export const getLastSyncMetadata = tb.buildPipe({
  pipe: 'get_last_sync_metadata',
  parameters: z.object({
    organization_id: z.string(),
    channel_id: z.string(),
  }),
  data: z.object({
    organization_id: z.string(),
    channel_id: z.string(),
    video_id: z.string().optional(),
    last_sync_time: z.string().optional(),
    oldest_comment_time: z.string().optional(),
    newest_comment_time: z.string().optional(),
    next_page_token: z.string().optional(),
    comments_synced: z.number().optional(),
    sync_status: z.string().optional(),
    error_message: z.string().optional(),
  }),
});

export const getLatestAndOldestComment = tb.buildPipe({
  pipe: 'get_latest_and_oldest_comment',
  parameters: z.object({
    organization_id: z.string(),
  }),
  data: z.object({
    organization_id: z.string(),
    newest_comment_id: z.string(),
    newest_comment_time: z.string(),
    oldest_comment_id: z.string(),
    oldest_comment_time: z.string(),
  }),
});

export const getCommentsWithReplies = tb.buildPipe({
  pipe: 'get_comments_with_replies',
  parameters: z.object({
    organization_id: z.string(),
    video_id: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  data: z.object({
    organization_id: z.string(),
    comment_id: z.string(),
    comment_text: z.string(),
    author_display_name: z.string(),
    author_profile_image_url: z.string(),
    author_channel_id: z.string(),
    like_count: z.number(),
    published_at: z.string(),
    updated_at: z.string(),
    video_id: z.string(),
    parent_id: z.string().nullish(),
    reply_id: z.string().nullish(),
    reply_count: z.number(),
    is_thread: z.number(),
  }),
});

export const getYoutubeCommentThreads = tb.buildPipe({
  pipe: 'get_youtube_comment_threads',
  parameters: z.object({
    organization_id: z.string(),
    video_id: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  data: z.object({
    organization_id: z.string(),
    comment_id: z.string(),
    comment_text: z.string(),
    author_display_name: z.string(),
    author_profile_image_url: z.string(),
    author_channel_id: z.string(),
    like_count: z.number(),
    published_at: z.string(),
    updated_at: z.string(),
    video_id: z.string(),
    parent_id: z.string().nullish(),
    reply_id: z.string().nullish(),
    reply_count: z.number(),
    is_thread: z.number(),
  }),
});

export const getYoutubeCommentReplies = tb.buildPipe({
  pipe: 'get_youtube_comment_replies',
  parameters: z.object({
    organization_id: z.string(),
    parent_id: z.string(),
    video_id: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
  }),
  data: z.object({
    organization_id: z.string(),
    comment_id: z.string(),
    comment_text: z.string(),
    author_display_name: z.string(),
    author_profile_image_url: z.string(),
    author_channel_id: z.string(),
    like_count: z.number(),
    published_at: z.string(),
    updated_at: z.string(),
    video_id: z.string(),
    parent_id: z.string().nullish(),
    reply_id: z.string().nullish(),
    reply_count: z.number(),
    is_thread: z.number(),
  }),
});

export const getYoutubeCommentCounts = tb.buildPipe({
  pipe: 'get_youtube_comment_counts',
  parameters: z.object({
    organization_id: z.string(),
  }),
  data: z.object({
    organization_id: z.string(),
    thread_count: z.number(),
    reply_count: z.number(),
    total_comments: z.number(),
  }),
});
