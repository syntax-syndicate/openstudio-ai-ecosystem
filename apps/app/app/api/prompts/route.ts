import { prompts } from '@/lib/prompts';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  //TODO: Get prompts from the database
  return NextResponse.json({ prompts: prompts });
}
