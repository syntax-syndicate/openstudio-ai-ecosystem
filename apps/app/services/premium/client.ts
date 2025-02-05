"use server";

import { currentOrganizationId, currentUser } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { premium } from '@repo/backend/schema';
import { and, eq } from 'drizzle-orm';
import { getCountPerUser } from '@repo/tinybird/src/query';

const TEN_YEARS = 10 * 365 * 24 * 60 * 60 * 1000;
const FIVE_YEARS = 5 * 365 * 24 * 60 * 60 * 1000;

export async function upgradeToPremium(options: {
  userId: string;
  organizationId: string;
  tier: 'PRO_MONTHLY' | 'PRO_ANNUALLY' | 'LIFETIME';
  lemonSqueezyRenewsAt: Date | null;
  lemonSqueezySubscriptionId: number | null;
  lemonSqueezySubscriptionItemId: number | null;
  lemonSqueezyOrderId: number | null;
  lemonSqueezyCustomerId: number | null;
  lemonSqueezyProductId: number | null;
  lemonSqueezyVariantId: number | null;
}) {
  // const organizationId = await currentOrganizationId();
  // const userData = await currentUser();

  // if (!organizationId || !userData) throw new Error('Unauthorized');

  const { ...rest } = options;

  const lemonSqueezyRenewsAt =
    options.tier === 'LIFETIME'
      ? new Date(Date.now() + TEN_YEARS)
      : options.lemonSqueezyRenewsAt;

  const premiumData = await database
    .select()
    .from(premium)
    .where(
      and(
        eq(premium.userId, rest.userId),
        eq(premium.organizationId, rest.organizationId)
      )
    )
    .then((result) => result[0]);

  if (premiumData) {
    return await database
      .update(premium)
      .set({
        tier: rest.tier,
        lemon_squeezy_customer_id: rest.lemonSqueezyCustomerId,
        lemon_squeezy_subscription_id: rest.lemonSqueezySubscriptionId,
        lemon_squeezy_subscription_item_id: rest.lemonSqueezySubscriptionItemId,
        lemon_squeezy_order_id: rest.lemonSqueezyOrderId,
        lemon_squeezy_product_id: rest.lemonSqueezyProductId,
        lemon_squeezy_variant_id: rest.lemonSqueezyVariantId,
        lemon_squeezy_renews_at: lemonSqueezyRenewsAt,
      })
      .where(
        and(
          eq(premium.userId, rest.userId),
          eq(premium.organizationId, rest.organizationId)
        )
      )
      .returning();
  } else {
    return await database
      .insert(premium)
      .values({
        tier: rest.tier,
        lemon_squeezy_customer_id: rest.lemonSqueezyCustomerId,
        lemon_squeezy_subscription_id: rest.lemonSqueezySubscriptionId,
        lemon_squeezy_subscription_item_id: rest.lemonSqueezySubscriptionItemId,
        lemon_squeezy_order_id: rest.lemonSqueezyOrderId,
        lemon_squeezy_product_id: rest.lemonSqueezyProductId,
        lemon_squeezy_variant_id: rest.lemonSqueezyVariantId,
        lemon_squeezy_renews_at: lemonSqueezyRenewsAt,
        userId: rest.userId,
        organizationId: rest.organizationId,
      })
      .returning();
  }
}

// extend premium
export async function extendPremium(options: {
  premiumId: string;
  lemonSqueezyRenewsAt: Date | null;
}) {
  return await database
    .update(premium)
    .set({
      lemon_squeezy_renews_at: options.lemonSqueezyRenewsAt,
    })
    .where(eq(premium.id, options.premiumId))
    .returning();
}

// cancel premium
export async function cancelPremium(options: {
  premiumId: string;
  lemonSqueezyRenewsAt: Date;
}) {
  return await database
    .update(premium)
    .set({
      lemon_squeezy_renews_at: options.lemonSqueezyRenewsAt,
    })
    .where(eq(premium.id, options.premiumId))
    .returning();
}

// get premium
export async function getPremium() {
  const organizationId = await currentOrganizationId();
  const user = await currentUser();

  if (!organizationId || !user) throw new Error('Unauthorized');

  const premiumData = await database
    .select()
    .from(premium)
    .where(
      and(
        eq(premium.userId, user.id),
        eq(premium.organizationId, organizationId)
      )
    );

  const messagesCountPerMonth = await getCountPerUser({userEmail: user!.email!})
  console.log('messagesCountPerMonth', messagesCountPerMonth)

  return {
    premium: premiumData[0],
    user,
    messagesCountPerMonth : messagesCountPerMonth.data[0].count ?? 0,
  };
}
