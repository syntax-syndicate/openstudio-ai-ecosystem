import { prompts } from '@/app/lib/prompts';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, resp: NextResponse) {
  return NextResponse.json({ prompts: prompts });
}
