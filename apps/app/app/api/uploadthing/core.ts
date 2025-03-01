import { and, eq } from 'drizzle-orm';
import { type FileRouter, createUploadthing } from 'uploadthing/next';
import { UTApi, UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

import { getSession } from '@repo/backend/auth/session';
import { database } from '@repo/backend/database';
import { videos } from '@repo/backend/schema';

const f = createUploadthing();

export const ourFileRouter: FileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .middleware(async ({ input }) => {
      const {
        data: { session },
      } = await getSession();

      if (!session?.user.id) throw new UploadThingError('Unauthorized');

      const [existingVideo] = await database
        .select({
          thumbnailKey: videos.thumbnailKey,
        })
        .from(videos)
        .where(
          and(
            eq(videos.id, input.videoId),
            eq(videos.userId, session.user.id),
            eq(
              videos.organizationId,
              session.user.user_metadata.organization_id
            )
          )
        );

      if (!existingVideo) throw new UploadThingError('Not found');

      if (existingVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(existingVideo.thumbnailKey);
        await database
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(
            and(
              eq(videos.id, input.videoId),
              eq(videos.userId, session.user.id),
              eq(
                videos.organizationId,
                session.user.user_metadata.organization_id
              )
            )
          );
      }

      return { session, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await database
        .update(videos)
        .set({
          thumbnailUrl: file.url,
          thumbnailKey: file.key,
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.session.user.id),
            eq(
              videos.organizationId,
              metadata.session.user.user_metadata.organization_id
            )
          )
        );

      console.log('uploaded thumbnail');

      return { uploadedBy: metadata.session.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
