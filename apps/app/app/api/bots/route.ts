import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  //TODO: add db query to get bots
  return NextResponse.json({ bots: [] });
}
