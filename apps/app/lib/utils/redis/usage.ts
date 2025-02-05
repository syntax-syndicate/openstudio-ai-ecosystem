// import "server-only";
import {z} from "zod";
import { redis } from "@repo/rate-limit";

// i want to store ai calls
const usageSchema = z.object({
  aiCalls: z.number().default(0),
  totalTokensUsed: z.number().default(0),
  inputTokensUsed: z.number().int().default(0),
  outputTokensUsed: z.number().int().default(0),
  cost: z.number().default(0),
});

type TUsage = z.infer<typeof usageSchema>;


function getUsageKey(email: string) {
  return `usage:${email}`;
}

export async function getUsage(options: { email: string }) {
    const key = getUsageKey(options.email);
    const data = await redis.hgetall<TUsage>(key);
    return data;
}

export async function saveUsage(options: {email: string; usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
}; cost: number}) {
    const {email, usage, cost} = options;
    const key = getUsageKey(email);
    
    Promise.all([
        redis.hincrby(key, 'aiCalls', 1),
        redis.hincrby(key, 'totalTokensUsed', usage.total_tokens),
        redis.hincrby(key, 'inputTokensUsed', usage.input_tokens),
        redis.hincrby(key, 'outputTokensUsed', usage.output_tokens),
        redis.hincrbyfloat(key, 'cost', cost),
    ]);
}