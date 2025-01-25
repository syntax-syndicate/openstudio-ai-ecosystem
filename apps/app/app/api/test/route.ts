import { updateUsername } from '@/actions/users';
import { createClient } from '@repo/backend/auth/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get username from URL search params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || typeof username !== 'string') {
      return new Response(
        'Please provide a username in the URL: /api/test?username=newname',
        { status: 400 }
      );
    }

    return updateUsername(user, username);
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
