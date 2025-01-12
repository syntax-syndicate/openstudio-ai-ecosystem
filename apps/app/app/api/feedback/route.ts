import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, resp: NextResponse) {
  const { feedback, feedbackType, email } = await req.json();
  if (!feedback || !feedbackType) {
    return NextResponse.json({
      success: false,
      error: 'Feedback and feedback type are required',
    });
  }
  //TODO: Insert into feedbacks table using prisma
  return NextResponse.json({ success: true });
}
