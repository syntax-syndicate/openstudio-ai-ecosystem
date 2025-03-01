import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';
import { generateVideoMetadata, generateYoutubeTitle } from '@repo/jobs';
import {
  type VideoAssetCreatedWebhookEvent,
  type VideoAssetDeletedWebhookEvent,
  type VideoAssetErroredWebhookEvent,
  type VideoAssetReadyWebhookEvent,
  type VideoAssetTrackReadyWebhookEvent,
  type WebhookEvent,
  mux,
} from '@repo/mux';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { UTApi } from 'uploadthing/server';

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

export const POST = async (request: Request) => {
  if (!SIGNING_SECRET) {
    throw new Error('MUX_WEBHOOK_SECRET is not set');
  }

  const headersPayload = await headers();
  const muxSignature = headersPayload.get('mux-signature');

  if (!muxSignature) {
    return new Response('No signature found', { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      'mux-signature': muxSignature,
    },
    SIGNING_SECRET
  );

  switch (payload.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payload.data as VideoAssetCreatedWebhookEvent['data'];
      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      console.log('Creating video: ', { uploadId: data.upload_id });

      await database
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case 'video.asset.ready': {
      const data = payload.data as VideoAssetReadyWebhookEvent['data'];
      const playbackId = data.playback_ids?.[0].id;

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      if (!playbackId) {
        return new Response('No playback id found', { status: 400 });
      }

      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      const utapi = new UTApi();
      const [uploadedThumbnail, uploadedPreview] =
        await utapi.uploadFilesFromUrl([tempThumbnailUrl, tempPreviewUrl]);

      if (!uploadedThumbnail.data || !uploadedPreview.data) {
        return new Response('Failed to upload thumbnail or preview', {
          status: 500,
        });
      }

      const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumbnail.data;
      const { key: previewKey, url: previewUrl } = uploadedPreview.data;
      await database
        .update(videos)
        .set({
          muxPlaybackId: playbackId,
          thumbnailUrl,
          thumbnailKey,
          previewUrl,
          previewKey,
          duration,
          muxStatus: data.status,
          muxAssetId: data.id,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case 'video.asset.errored': {
      const data = payload.data as VideoAssetErroredWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      await database
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case 'video.asset.deleted': {
      const data = payload.data as VideoAssetDeletedWebhookEvent['data'];

      if (!data.upload_id) {
        return new Response('No upload id found', { status: 400 });
      }

      console.log('Deleting video: ', { uploadId: data.upload_id });

      await database
        .delete(videos)
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case 'video.asset.track.ready': {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent['data'] & {
        asset_id: string;
      };

      console.log('Track ready');

      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) {
        return new Response('No asset id found', { status: 400 });
      }

      await database
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));

      const [video] = await database
        .select()
        .from(videos)
        .where(eq(videos.muxAssetId, assetId));

      if (!video) {
        return new Response('Video not found', { status: 404 });
      }

      console.log('Generating title for video: ', { videoId: video.id });

      await generateYoutubeTitle.trigger({
        videoId: video.id,
        userId: video.userId,
        organizationId: video.organizationId,
      });
      console.log('Generated title for video: ', { videoId: video.id });
      console.log('Generating video metadata for video: ', {
        videoId: video.id,
      });

      await generateVideoMetadata.trigger({
        videoId: video.id,
        userId: video.userId,
        organizationId: video.organizationId,
      });

      console.log('Generated video metadata for video: ', {
        videoId: video.id,
      });
      break;
    }
  }

  return new Response('Webhook received', { status: 200 });
};
