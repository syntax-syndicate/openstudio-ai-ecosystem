import { database } from '@repo/backend/database';
import { feedbacks } from '@repo/backend/schema';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { feedback, feedbackType, email } = await req.json();
  if (!feedback || !feedbackType) {
    return NextResponse.json({
      success: false,
      error: 'Feedback and feedback type are required',
    });
  }
  // await database.insert(feedbacks).values({
  //   feedback,
  //   feedbackType,
  //   email,
  // });

  return NextResponse.json({ success: true });
}
