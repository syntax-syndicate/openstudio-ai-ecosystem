import { env } from '@/env';
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import axios from 'axios';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const ratelimiter = createRateLimiter({
      limiter: slidingWindow(90, '1 d'), // 5 requests from the same IP in 1 day
    });
    const head = await headers();
    const ip = head.get('x-forwarded-for');

    const { success } = await ratelimiter.limit(`chathub_completions_${ip}`);

    if (!success) {
      return NextResponse.json(
        { message: 'Too many requests' },
        { status: 429 }
      );
    }
  }
  const body = await req.json();
  const response = await axios({
    method: 'POST',
    url: process.env.OPENAI_API_URL,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    data: {
      ...body,
      model: 'gpt-4o-mini',
      stream: true,
    },
    responseType: 'stream',
  });

  return new Response(response.data, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
    status: response.status,
  });
}
