import { database } from '@repo/backend/database';
import { youtubeIntegration } from '@repo/backend/schema';
import { eq } from 'drizzle-orm';
import type { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export async function getValidAccessToken(organizationId: string) {
  // Get current integration data
  const [integration] = await database
    .select()
    .from(youtubeIntegration)
    .where(eq(youtubeIntegration.organizationId, organizationId));

  if (!integration) {
    throw new Error('YouTube integration not found');
  }

  // Check if current token is still valid (with 5 min buffer)
  const isExpired =
    new Date(integration.expiryDate).getTime() - 5 * 60 * 1000 < Date.now();

  if (!isExpired) {
    return integration.accessToken;
  }

  // Token is expired, refresh it
  const auth = getOAuth2Client();
  auth.setCredentials({
    refresh_token: integration.refreshToken,
    access_token: integration.accessToken,
    expiry_date: integration.expiryDate.getTime(),
  });

  try {
    const { credentials } = await auth.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error('Failed to refresh YouTube access token');
    }

    // Update database with new tokens
    await database
      .update(youtubeIntegration)
      .set({
        accessToken: credentials.access_token,
        expiryDate: new Date(credentials.expiry_date!),
        ...(credentials.refresh_token && {
          refreshToken: credentials.refresh_token,
        }),
      })
      .where(eq(youtubeIntegration.organizationId, organizationId));

    return credentials.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh YouTube access token');
  }
}

export async function getYouTubeClient(organizationId: string) {
  const accessToken = await getValidAccessToken(organizationId);
  const auth = getOAuth2Client();
  auth.setCredentials({ access_token: accessToken });

  return google.youtube({ version: 'v3', auth });
}

export async function listYouTubeVideos(organizationId: string) {
  const youtube = await getYouTubeClient(organizationId);

  try {
    // const response = await youtube.videos.list({
    //   part: ['snippet,contentDetails'],
    //   myRating: 'like',
    // });
    const res = await youtube.channels.list({
      part: ['contentDetails'],
      //   managedByMe: true,
      //   mySubscribers: true,
      forHandle: '@kuluruvineeth',
    });
    return res.data;
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

export const getOAuth2Client = (): OAuth2Client => {
  const auth = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/callbacks/youtube`
  );

  return auth;
};
