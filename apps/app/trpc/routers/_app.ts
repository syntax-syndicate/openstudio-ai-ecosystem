import { studioRouter } from '@/modules/tube/studio/server/procedures';
import { videosRouter } from '@/modules/tube/videos/server/procedures';
import { userRouter } from '@/modules/user/server/procedures';
import { youtubeRouter } from '@/modules/youtube/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  youtube: youtubeRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
