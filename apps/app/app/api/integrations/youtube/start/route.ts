import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { integrationStates } from '@repo/backend/schema';
import { getOAuth2Client } from '@repo/youtube';
import { NextResponse } from 'next/server';

export const GET = async (): Promise<Response> => {
  const [user, organizationId] = await Promise.all([
    currentUser(),
    currentOrganizationId(),
  ]);

  if (!user || !organizationId) {
    throw new Error('Unauthorized');
  }

  const state = await database
    .insert(integrationStates)
    .values({
      organizationId,
      creatorId: user.id,
      platform: 'YOUTUBE',
    })
    .returning({ id: integrationStates.id });

  const auth = getOAuth2Client().generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/youtubepartner-channel-audit',
      'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
      'https://www.googleapis.com/auth/yt-analytics.readonly',
      'https://www.googleapis.com/auth/youtubepartner',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.channel-memberships.creator',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
    response_type: 'code',
    prompt: 'consent',
    redirect_uri: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/callbacks/youtube`,
    state: state[0].id,
  });

  return NextResponse.redirect(auth);
};
