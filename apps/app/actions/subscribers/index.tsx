'use server';
import { formatVerboseDate } from '@/helper/utils';
import type { subscribeSchema } from '@/lib/validations/subscribe';
import type { ExportResponse } from '@/types/minime';
import { database } from '@repo/backend/database';
import { subscribers } from '@repo/backend/schema';
import { and, desc, eq } from 'drizzle-orm';
import { json2csv } from 'json-2-csv';
import type * as z from 'zod';

type SubscriberSchema = z.infer<typeof subscribeSchema>;

export async function createSubscriber(userId: string, data: SubscriberSchema) {
  const [newSubscriber] = await database
    .insert(subscribers)
    .values({
      name: data.name,
      email: data.email,
      userId,
    })
    .returning();
  return newSubscriber;
}

export async function deleteSubscriber(subscriberId: string, userId: string) {
  const [deletedSubscriber] = await database
    .delete(subscribers)
    .where(
      and(eq(subscribers.id, subscriberId), eq(subscribers.userId, userId))
    )
    .returning();
  return deletedSubscriber.id;
}

export async function isSubscriberExist(email: string, userId: string) {
  const count = await database
    .select()
    .from(subscribers)
    .where(and(eq(subscribers.userId, userId), eq(subscribers.email, email)));
  return count.length > 0;
}

export async function verifySubscriberAccess(id: string, userId: string) {
  const count = await database
    .select()
    .from(subscribers)
    .where(and(eq(subscribers.id, id), eq(subscribers.userId, userId)));
  return count.length > 0;
}

export async function getSubscibersExport(
  userId: string
): Promise<ExportResponse> {
  const subscribersList = await database
    .select({
      name: subscribers.name,
      email: subscribers.email,
      createdAt: subscribers.createdAt,
    })
    .from(subscribers)
    .where(eq(subscribers.userId, userId));

  const filename = `openstudio_minime_subscribers_export.csv`;

  const content = json2csv(
    subscribersList.map(({ createdAt, ...subscriber }) => {
      return { ...subscriber, subscribedAt: formatVerboseDate(createdAt) };
    })
  );

  return { filename, content };
}

export async function getSubscribersByUserId(userId: string) {
  return await database
    .select()
    .from(subscribers)
    .where(eq(subscribers.userId, userId))
    .orderBy(desc(subscribers.createdAt));
}
