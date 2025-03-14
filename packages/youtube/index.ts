import { database } from '@repo/backend/database';
import { youtubeIntegration } from '@repo/backend/schema';
import { eq } from 'drizzle-orm';
import type { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

//TODO: change any to the actual type
export async function getValidAccessToken(
  organizationId: string,
  integrationData?: any
) {
  let integration;
  if (integrationData) {
    integration = integrationData;
  } else {
    // Get current integration data
    integration = await database
      .select()
      .from(youtubeIntegration)
      .where(eq(youtubeIntegration.organizationId, organizationId));

    console.log('integration', integration[0]);

    if (!integration[0]) {
      throw new Error('YouTube integration not found');
    }
  }

  // Check if current token is still valid (with 5 min buffer)
  const isExpired =
    new Date(integration[0].expiryDate).getTime() - 5 * 60 * 1000 < Date.now();

  if (!isExpired) {
    return integration[0].accessToken;
  }

  // Token is expired, refresh it
  const auth = getOAuth2Client();
  auth.setCredentials({
    refresh_token: integration[0].refreshToken,
    access_token: integration[0].accessToken,
    expiry_date: integration[0].expiryDate.getTime(),
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

//TODO: change any to the actual type
export async function getYouTubeClient(
  organizationId: string,
  integrationData?: any
) {
  const accessToken = await getValidAccessToken(
    organizationId,
    integrationData
  );
  const auth = getOAuth2Client();
  auth.setCredentials({ access_token: accessToken });

  return google.youtube({ version: 'v3', auth });
}

//TODO: Remove after testing
export async function listYouTubeVideos(organizationId: string) {
  const youtube = await getYouTubeClient(organizationId);

  try {
    const res = await youtube.channels.list({
      part: ['contentDetails'],
      forHandle: '@kuluruvineeth',
    });
    return res.data;
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
}

//TODO: change any to the actual type
export async function getYouTubeChannelId(
  organizationId: string,
  integrationData?: any
) {
  const youtube = await getYouTubeClient(organizationId, integrationData);

  try {
    const res = await youtube.channels.list({
      part: ['id'],
      mine: true,
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
    `https://app.openstudio.tech/callbacks/youtube`
  );

  return auth;
};
