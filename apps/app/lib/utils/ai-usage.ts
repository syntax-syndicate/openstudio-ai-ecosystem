'use server';

import { calculateCost } from '@/config/models';
import type { TModelItem } from '@/types';
import { publishAICall } from '@repo/tinybird/src/publish';
import { saveUsage } from './redis/usage';

export async function saveAiUsage({
  email,
  userId,
  organizationId,
  model,
  usage,
}: {
  email: string;
  userId: string;
  organizationId: string;
  model: TModelItem;
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}) {
  const cost = calculateCost(model, usage);
  return Promise.all([
    publishAICall({
      userId,
      organizationId,
      totalTokens: usage.total_tokens,
      completionTokens: usage.output_tokens,
      promptTokens: usage.input_tokens,
      cost,
      model: model.name,
      provider: model.provider,
      userEmail: email,
      timestamp: Date.now(),
    }),
    saveUsage({ email, usage, cost }),
  ]);
}
