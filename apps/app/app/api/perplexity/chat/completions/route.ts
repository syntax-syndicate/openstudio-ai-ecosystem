import { env } from '@/env';
import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
import axios from 'axios';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  //   const ratelimiter = createRateLimiter({
  //     limiter: slidingWindow(15, '1 d'), // 10 requests from the same IP in 1 day
  //   });
  //   const head = await headers();
  //   const ip = head.get('x-forwarded-for');

  //   const { success } = await ratelimiter.limit(`chathub_completions_${ip}`);

  //   if (!success) {
  //     return NextResponse.json(
  //       { message: 'Exceeded daily chathub usage limit' },
  //       { status: 429 }
  //     );
  //   }
  // }
  const body = await req.json();
  const messages = [
    body.messages[0], // system message
    body.messages[body.messages.length - 1] // last user message
  ];

  // Transform OpenAI format to Perplexity format
  const perplexityBody = {
    model: body.model,
    messages: messages,
    temperature: body.temperature || 0.7,
    max_tokens: body.max_tokens || 2000,
    top_p: body.top_p || 1,
    stream: body.stream || false
  };

  const response = await axios({
    method: 'POST',
    url: `${process.env.CLOUDFLARE_AI_GATEWAY_URL}/perplexity-ai/chat/completions`,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': body.stream ? 'text/event-stream' : 'application/json',
    },
    data: perplexityBody,
    ...(body.stream ? { responseType: 'stream' } : {})
  });

  if (body.stream) {
    return new Response(response.data, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
      status: response.status,
    });
  }

  return NextResponse.json(response.data);
}
