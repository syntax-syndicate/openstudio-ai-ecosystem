import { getChatsByUserId } from '@/lib/queries';
import { currentUser } from '@repo/backend/auth/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await currentUser();

  if (!user) return new Response('Unauthorized', { status: 401 });

  const chats = await getChatsByUserId({ id: user.id });

  return NextResponse.json(chats);
}
