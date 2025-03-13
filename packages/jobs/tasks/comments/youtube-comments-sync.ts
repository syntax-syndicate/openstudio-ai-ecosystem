import { database } from '@repo/backend/database';
import { organization } from '@repo/backend/schema';
import {
  publishYoutubeCommentReply,
  publishYoutubeCommentThread,
  publishYoutubeSyncMetadata,
} from '@repo/tinybird/src/publish';
import {
  getLastSyncMetadata,
  getLatestAndOldestComment,
} from '@repo/tinybird/src/query';
import { getYouTubeClient } from '@repo/youtube';
import { metadata, schemaTask } from '@trigger.dev/sdk/v3';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const syncYoutubeComments = schemaTask({
  id: 'sync-youtube-comments',
  schema: z.object({
    organizationId: z.string(),
    syncFrequency: z
      .enum([
        'manual',
        'hourly',
        '6hours',
        '12hours',
        'daily',
        'weekly',
        'monthly',
        'quaterly',
        'half_yearly',
        'yearly',
      ])
      .describe('The frequency at which the comments are synced'),
  }),
  run: async ({ organizationId, syncFrequency }) => {
    console.log('Syncing YouTube comments for organization', organizationId);

    // Set initial metadata
    metadata.set('progress', 0);
    metadata.set('status', 'initializing');
    metadata.set('organizationId', organizationId);
    metadata.set('syncFrequency', syncFrequency);
    metadata.set('commentsProcessed', 0);

    try {
      const [organizationData] = await database
        .select()
        .from(organization)
        .where(eq(organization.id, organizationId));

      if (!organizationData || !organizationData.youtubeChannelId) {
        metadata.set('status', 'failed');
        metadata.set(
          'error',
          'Organization not found or YouTube channel ID not set'
        );
        throw new Error('Organization not found or YouTube channel ID not set');
      }

      const youtubeChannelId = organizationData.youtubeChannelId;
      metadata.set('channelId', youtubeChannelId);
      metadata.set('status', 'authenticating');
      metadata.set('progress', 5);
      const youtubeClient = await getYouTubeClient(organizationData.id);

      // Initialize variables for tracking sync progress
      let totalCommentsFetched = 0;
      let oldestCommentTime = '';
      let newestCommentTime = '';
      const processedCommentIds = new Set<string>();

      // For testing: Set a maximum number of comments to fetch
      const MAX_COMMENTS_TO_FETCH = 500;
      metadata.set('maxCommentsToFetch', MAX_COMMENTS_TO_FETCH);

      // Record the current time as the start of this sync
      const syncStartTime = new Date().toISOString();
      metadata.set('syncStartTime', syncStartTime);

      // Update metadata - preparing sync
      metadata.set('status', 'preparing');
      metadata.set('progress', 10);

      // Get the last sync metadata to retrieve the stored page token
      const lastSyncMetadata = await getLastSyncMetadata({
        organization_id: organizationData.id,
        channel_id: youtubeChannelId,
      });

      const storedPageToken =
        lastSyncMetadata?.data[0]?.next_page_token || null;

      // Get the latest and oldest comment info for more accurate timestamp tracking
      let lastNewestCommentTime = null;
      let lastNewestCommentId = null;

      try {
        const commentBoundaries = await getLatestAndOldestComment({
          organization_id: organizationData.id,
        });

        if (commentBoundaries) {
          lastNewestCommentTime = commentBoundaries.data[0].newest_comment_time;
          lastNewestCommentId = commentBoundaries.data[0].newest_comment_id;
          oldestCommentTime = commentBoundaries.data[0].oldest_comment_time;

          // Add the newest comment ID to processed set to avoid re-ingesting it
          if (lastNewestCommentId) {
            processedCommentIds.add(lastNewestCommentId);
          }
        }
      } catch (error) {
        console.log('No existing comments found, performing full sync');
      }

      let phase1PageToken;
      let phase1CommentCount = 0; // Track comments in phase 1
      // Phase 1: Fetch newest comments first
      console.log('Phase 1: Fetching newest comments first');
      if (lastNewestCommentTime || storedPageToken === null) {
        phase1PageToken = null;
        let hasMoreNewComments = true;

        metadata.set('status', 'fetching_recent_comments');
        metadata.set('progress', 15);
        metadata.set('phase', '1');

        while (
          hasMoreNewComments &&
          totalCommentsFetched < MAX_COMMENTS_TO_FETCH
        ) {
          // Update progress for each page
          metadata.set('pageToken', phase1PageToken);
          //TODO: Fix this type error
          const comments: any = await youtubeClient.commentThreads.list({
            part: ['snippet', 'replies'],
            allThreadsRelatedToChannelId: youtubeChannelId,
            maxResults: 100,
            order: 'time', // Sort by time to get newest first
            ...(phase1PageToken && { pageToken: phase1PageToken }),
          });

          // Update metadata with comment count
          metadata.set('currentBatchSize', comments.data.items?.length || 0);

          if (!comments.data.items || comments.data.items.length === 0) {
            hasMoreNewComments = false;
            break;
          }

          let shouldContinuePhase1 = true;

          for (const comment of comments.data.items) {
            // For testing: Check if we've reached the maximum
            if (totalCommentsFetched >= MAX_COMMENTS_TO_FETCH) {
              console.log(
                `Reached maximum of ${MAX_COMMENTS_TO_FETCH} comments, stopping Phase 1`
              );
              hasMoreNewComments = false;
              break;
            }

            const commentId = comment.id!;

            // Skip if we've already processed this comment
            if (processedCommentIds.has(commentId)) {
              console.log(`Skipping already processed comment: ${commentId}`);
              continue;
            }

            const commentDate = new Date(
              comment.snippet?.topLevelComment?.snippet?.publishedAt!
            );

            if (
              lastNewestCommentTime &&
              commentDate.getTime() <=
                new Date(
                  lastNewestCommentTime?.replace(' ', 'T') + 'Z'
                ).getTime()
            ) {
              console.log(
                'Found comment older than or equal to last newest comment, stopping Phase 1'
              );
              shouldContinuePhase1 = false;
              break;
            }

            // Add to processed IDs to avoid duplicates in Phase 2
            processedCommentIds.add(commentId);

            // Update newest/oldest comment times
            const commentTimeStr = commentDate.toISOString();
            if (
              !newestCommentTime ||
              commentDate > new Date(newestCommentTime)
            ) {
              newestCommentTime = commentTimeStr;
            }
            if (
              !oldestCommentTime ||
              commentDate < new Date(oldestCommentTime)
            ) {
              oldestCommentTime = commentTimeStr;
            }

            // Store the comment
            await publishYoutubeCommentThread({
              id: commentId,
              video_id: comment.snippet?.videoId!,
              channel_id: youtubeChannelId,
              organization_id: organizationData.id,
              author_display_name:
                comment.snippet?.topLevelComment?.snippet?.authorDisplayName!,
              author_profile_image_url:
                comment.snippet?.topLevelComment?.snippet
                  ?.authorProfileImageUrl!,
              author_channel_url:
                comment.snippet?.topLevelComment?.snippet?.authorChannelUrl!,
              author_channel_id:
                comment.snippet?.topLevelComment?.snippet?.authorChannelId
                  ?.value!,
              text_display:
                comment.snippet?.topLevelComment?.snippet?.textDisplay!,
              text_original:
                comment.snippet?.topLevelComment?.snippet?.textOriginal!,
              like_count: comment.snippet?.topLevelComment?.snippet?.likeCount!,
              published_at:
                comment.snippet?.topLevelComment?.snippet?.publishedAt!,
              updated_at: comment.snippet?.topLevelComment?.snippet?.updatedAt!,
              can_reply: comment.snippet?.canReply ? 1 : 0,
              total_reply_count: comment.snippet?.totalReplyCount!,
              is_public: comment.snippet?.isPublic ? 1 : 0,
              moderation_status:
                comment.snippet?.topLevelComment?.snippet?.moderationStatus ??
                'published',
              is_processed: 0,
              created_at: new Date().toISOString(),
              synced_at: new Date().toISOString(),
            });

            // Process replies if any
            if (
              comment.replies &&
              comment.replies.comments &&
              comment.replies.comments.length > 0
            ) {
              for (const reply of comment.replies.comments) {
                const replyId = reply.id!;

                // Skip if we've already processed this reply
                if (processedCommentIds.has(replyId)) {
                  console.log(`Skipping already processed reply: ${replyId}`);
                  continue;
                }

                processedCommentIds.add(replyId);

                const replyDate = new Date(reply.snippet?.publishedAt!);

                // Update comment time tracking
                const replyTimeStr = replyDate.toISOString();
                if (
                  !newestCommentTime ||
                  replyDate > new Date(newestCommentTime)
                ) {
                  newestCommentTime = replyTimeStr;
                }
                if (
                  !oldestCommentTime ||
                  replyDate < new Date(oldestCommentTime)
                ) {
                  oldestCommentTime = replyTimeStr;
                }

                await publishYoutubeCommentReply({
                  id: replyId,
                  parent_id: commentId,
                  video_id: comment.snippet?.videoId!,
                  channel_id: youtubeChannelId,
                  organization_id: organizationData.id,
                  author_display_name: reply.snippet?.authorDisplayName!,
                  author_profile_image_url:
                    reply.snippet?.authorProfileImageUrl!,
                  author_channel_url: reply.snippet?.authorChannelUrl!,
                  author_channel_id: reply.snippet?.authorChannelId?.value!,
                  text_display: reply.snippet?.textDisplay!,
                  text_original: reply.snippet?.textOriginal!,
                  like_count: reply.snippet?.likeCount!,
                  published_at: reply.snippet?.publishedAt!,
                  updated_at: reply.snippet?.updatedAt!,
                  moderation_status:
                    reply.snippet?.moderationStatus ?? 'published',
                  is_processed: 0,
                  created_at: new Date().toISOString(),
                  synced_at: new Date().toISOString(),
                });

                totalCommentsFetched++;

                // Update counters and metadata after each batch
                phase1CommentCount = totalCommentsFetched; // Update phase 1 count
                metadata.set('commentsProcessed', totalCommentsFetched);
                metadata.set('phase1Count', phase1CommentCount);
                // Calculate progress as percentage between Phase 1 (20-50%)
                const phase1Progress =
                  20 +
                  Math.min(
                    30,
                    (totalCommentsFetched / MAX_COMMENTS_TO_FETCH) * 30
                  );
                metadata.set('progress', Math.round(phase1Progress));

                // For testing: Check if we've reached the maximum
                if (totalCommentsFetched >= MAX_COMMENTS_TO_FETCH) {
                  console.log(
                    `Reached maximum of ${MAX_COMMENTS_TO_FETCH} comments, stopping Phase 1`
                  );
                  hasMoreNewComments = false;
                  break;
                }
              }
            }

            totalCommentsFetched++;
          }

          if (!shouldContinuePhase1) {
            hasMoreNewComments = false;
            break;
          }

          // Get the next page token for Phase 1
          phase1PageToken = comments.data.nextPageToken;

          if (!phase1PageToken) {
            hasMoreNewComments = false;
          }

          // Sleep to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      const phase1Count = phase1CommentCount;
      let phase2PageToken;
      // Phase 2: Continue with regular pagination using stored page token
      console.log('Phase 2: Continuing with regular pagination');
      if (totalCommentsFetched < MAX_COMMENTS_TO_FETCH) {
        phase2PageToken = storedPageToken;
        let hasMoreOldComments = true;

        if (phase2PageToken === null) {
          hasMoreOldComments = false;
        }

        metadata.set('status', 'fetching_older_comments');
        metadata.set('progress', 50);
        metadata.set('phase', '2');
        metadata.set('phase2StartingPageToken', phase2PageToken);

        while (
          hasMoreOldComments &&
          totalCommentsFetched < MAX_COMMENTS_TO_FETCH
        ) {
          //TODO: Fix this type error
          const comments: any = await youtubeClient.commentThreads.list({
            part: ['snippet', 'replies'],
            allThreadsRelatedToChannelId: youtubeChannelId,
            maxResults: 100,
            ...(phase2PageToken && { pageToken: phase2PageToken }),
          });

          if (!comments.data.items || comments.data.items.length === 0) {
            hasMoreOldComments = false;
            break;
          }

          for (const comment of comments.data.items) {
            // For testing: Check if we've reached the maximum
            if (totalCommentsFetched >= MAX_COMMENTS_TO_FETCH) {
              console.log(
                `Reached maximum of ${MAX_COMMENTS_TO_FETCH} comments, stopping Phase 2`
              );
              hasMoreOldComments = false;
              break;
            }

            const commentId = comment.id!;

            // Skip if already processed in Phase 1
            if (processedCommentIds.has(commentId)) {
              console.log(`Skipping already processed comment: ${commentId}`);
              continue;
            }

            processedCommentIds.add(commentId);

            const commentDate = new Date(
              comment.snippet?.topLevelComment?.snippet?.publishedAt!
            );

            // Update newest/oldest comment times
            const commentTimeStr = commentDate.toISOString();
            if (
              !newestCommentTime ||
              commentDate > new Date(newestCommentTime)
            ) {
              newestCommentTime = commentTimeStr;
            }
            if (
              !oldestCommentTime ||
              commentDate < new Date(oldestCommentTime)
            ) {
              oldestCommentTime = commentTimeStr;
            }

            // Store the comment
            await publishYoutubeCommentThread({
              id: commentId,
              video_id: comment.snippet?.videoId!,
              channel_id: youtubeChannelId,
              organization_id: organizationData.id,
              author_display_name:
                comment.snippet?.topLevelComment?.snippet?.authorDisplayName!,
              author_profile_image_url:
                comment.snippet?.topLevelComment?.snippet
                  ?.authorProfileImageUrl!,
              author_channel_url:
                comment.snippet?.topLevelComment?.snippet?.authorChannelUrl!,
              author_channel_id:
                comment.snippet?.topLevelComment?.snippet?.authorChannelId
                  ?.value!,
              text_display:
                comment.snippet?.topLevelComment?.snippet?.textDisplay!,
              text_original:
                comment.snippet?.topLevelComment?.snippet?.textOriginal!,
              like_count: comment.snippet?.topLevelComment?.snippet?.likeCount!,
              published_at:
                comment.snippet?.topLevelComment?.snippet?.publishedAt!,
              updated_at: comment.snippet?.topLevelComment?.snippet?.updatedAt!,
              can_reply: comment.snippet?.canReply ? 1 : 0,
              total_reply_count: comment.snippet?.totalReplyCount!,
              is_public: comment.snippet?.isPublic ? 1 : 0,
              moderation_status:
                comment.snippet?.topLevelComment?.snippet?.moderationStatus ??
                'published',
              is_processed: 0,
              created_at: new Date().toISOString(),
              synced_at: new Date().toISOString(),
            });

            // Process replies if any
            if (
              comment.replies &&
              comment.replies.comments &&
              comment.replies.comments.length > 0
            ) {
              for (const reply of comment.replies.comments) {
                const replyId = reply.id!;

                // Skip if already processed
                if (processedCommentIds.has(replyId)) {
                  console.log(`Skipping already processed reply: ${replyId}`);
                  continue;
                }

                processedCommentIds.add(replyId);

                const replyDate = new Date(reply.snippet?.publishedAt!);

                // Update comment time tracking
                const replyTimeStr = replyDate.toISOString();
                if (
                  !newestCommentTime ||
                  replyDate > new Date(newestCommentTime)
                ) {
                  newestCommentTime = replyTimeStr;
                }
                if (
                  !oldestCommentTime ||
                  replyDate < new Date(oldestCommentTime)
                ) {
                  oldestCommentTime = replyTimeStr;
                }

                await publishYoutubeCommentReply({
                  id: replyId,
                  parent_id: commentId,
                  video_id: comment.snippet?.videoId!,
                  channel_id: youtubeChannelId,
                  organization_id: organizationData.id,
                  author_display_name: reply.snippet?.authorDisplayName!,
                  author_profile_image_url:
                    reply.snippet?.authorProfileImageUrl!,
                  author_channel_url: reply.snippet?.authorChannelUrl!,
                  author_channel_id: reply.snippet?.authorChannelId?.value!,
                  text_display: reply.snippet?.textDisplay!,
                  text_original: reply.snippet?.textOriginal!,
                  like_count: reply.snippet?.likeCount!,
                  published_at: reply.snippet?.publishedAt!,
                  updated_at: reply.snippet?.updatedAt!,
                  moderation_status:
                    reply.snippet?.moderationStatus ?? 'published',
                  is_processed: 0,
                  created_at: new Date().toISOString(),
                  synced_at: new Date().toISOString(),
                });

                totalCommentsFetched++;

                metadata.set('commentsProcessed', totalCommentsFetched);
                // Calculate progress as percentage between Phase 2 (50-90%)
                const phase2Progress =
                  50 +
                  Math.min(
                    40,
                    ((totalCommentsFetched - phase1Count) /
                      MAX_COMMENTS_TO_FETCH) *
                      40
                  );
                metadata.set('progress', Math.round(phase2Progress));

                // For testing: Check if we've reached the maximum
                if (totalCommentsFetched >= MAX_COMMENTS_TO_FETCH) {
                  console.log(
                    `Reached maximum of ${MAX_COMMENTS_TO_FETCH} comments, stopping Phase 2`
                  );
                  hasMoreOldComments = false;
                  break;
                }
              }
            }

            totalCommentsFetched++;
          }

          // Get the next page token for Phase 2
          phase2PageToken = comments.data.nextPageToken;

          if (!phase2PageToken) {
            hasMoreOldComments = false;
          }

          // Sleep to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Mark sync as completed with final metadata
      // If we hit the limit, store the next page token for resuming later
      let finalPageToken = '';
      if (totalCommentsFetched >= MAX_COMMENTS_TO_FETCH) {
        // We hit the limit, so we're not done yet
        finalPageToken = phase2PageToken || phase1PageToken || '';
      }

      const finalStatus = finalPageToken ? 'in_progress' : 'completed';

      // Update final metadata
      metadata.set('status', finalStatus);
      metadata.set('progress', finalStatus === 'completed' ? 100 : 95);
      metadata.set('totalComments', totalCommentsFetched);
      metadata.set('oldestCommentTime', oldestCommentTime);
      metadata.set('newestCommentTime', newestCommentTime);
      metadata.set('nextPageToken', finalPageToken);
      metadata.set('syncCompleteTime', new Date().toISOString());

      console.log(
        `Sync ${finalStatus} with ${totalCommentsFetched} comments fetched`
      );
      if (finalStatus === 'in_progress') {
        console.log(`Storing page token for resuming: ${finalPageToken}`);
      }

      await publishYoutubeSyncMetadata({
        organization_id: organizationData.id,
        channel_id: youtubeChannelId,
        video_id: '',
        last_sync_time: syncStartTime,
        oldest_comment_time: oldestCommentTime,
        newest_comment_time: newestCommentTime,
        next_page_token: finalPageToken,
        comments_synced: totalCommentsFetched,
        sync_status: 'completed',
        error_message: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      return {
        status: 'success',
        commentsSynced: totalCommentsFetched,
        newestCommentTime,
        oldestCommentTime,
        finalStatus,
        nextPageToken: finalPageToken,
      };
    } catch (error) {
      // Update error metadata
      metadata.set('status', 'failed');
      metadata.set('error', 'Unknown error occurred');
      metadata.set('errorTime', new Date().toISOString());
      console.error('Error syncing YouTube comments', error);
      throw error;
    }
  },
});
