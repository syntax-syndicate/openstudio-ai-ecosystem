import { updateSession } from '@repo/backend/auth/middleware';
import type { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const middleware = async (request: NextRequest): Promise<NextResponse> =>
  updateSession(request);

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/uploadthing|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Always run for API routes
    // '/(api|trpc)(.*)',
  ],
};
