import { commentReactionsRouter } from '@/modules/tube/comment-reactions/server/procedures';
import { commentsRouter } from '@/modules/tube/comments/server/procedures';
import { categoriesRouter } from '@/modules/tube/home/categories/server/procedures';
import { searchRouter } from '@/modules/tube/search/server/procedures';
import { studioRouter } from '@/modules/tube/studio/server/procedures';
import { subscriptionsRouter } from '@/modules/tube/subscriptions/server/procedures';
import { suggestionsRouter } from '@/modules/tube/suggestions/server/procedures';
import { videoReactionsRouter } from '@/modules/tube/video-reactions/server/procedures';
import { videoViewsRouter } from '@/modules/tube/video-views/server/procedures';
import { videosRouter } from '@/modules/tube/videos/server/procedures';
import { userRouter } from '@/modules/user/server/procedures';
import { youtubeRouter } from '@/modules/youtube/server/procedures';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter,
  youtube: youtubeRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
