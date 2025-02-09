import crypto from 'crypto';
import { env } from '@/env';
import {
  cancelPremium,
  extendPremium,
  upgradeToPremium,
} from '@/services/premium';
import type { Payload } from '@/types/payment';
import { analytics } from '@repo/analytics/posthog/server';
import { createClient } from '@repo/backend/auth/server';
import { getUserById } from '@repo/backend/auth/utils';
import { database } from '@repo/backend/database';
import { premium } from '@repo/backend/schema';
import { keys } from '@repo/payments/keys';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

const getUserFromCustomerId = async (customerId: number) => {
  const supabase = await createClient();
  const { data } = await supabase.auth.admin.listUsers({
    perPage: 100_000,
  });
  const user = data.users.find(
    (user) => user.user_metadata.lemon_squeezy_customer_id === customerId
  );
  return user;
};

// https://docs.lemonsqueezy.com/help/webhooks#signing-requests
// https://gist.github.com/amosbastian/e403e1d8ccf4f7153f7840dd11a85a69
export const POST = async (request: Request) => {
  const payload = await getPayload(request);
  const userId = payload.meta.custom_data?.user_id;
  const organizationId = payload.meta.custom_data?.organization_id;

  if (!userId || !organizationId)
    throw new Error('No userId or organizationId provided');

  console.log('===Lemon event type:', payload.meta.event_name);

  //ignored events
  if (['subscription_payment_success'].includes(payload.meta.event_name)) {
    return NextResponse.json({ ok: true });
  }

  //lifetime plan
  const variant = payload.data.attributes.first_order_item?.variant_id;
  const isLifetimePlan = variant === env.NEXT_PUBLIC_LIFETIME_VARIANT_ID;

  //@ts-ignore
  if (payload.meta.event_name === 'order_created' && isLifetimePlan) {
    if (!userId) throw new Error('No userId provided');
    return await lifetimeOrder({ payload, userId, organizationId });
  }

  //monthly/annual subscription
  if (
    payload.meta.event_name === 'order_created' ||
    payload.meta.event_name === 'subscription_created'
  ) {
    if (!userId) throw new Error('No userId provided');

    return await subscriptionCreated({ payload, userId, organizationId });
  }

  const lemonSqueezyCustomerId = payload.data.attributes.customer_id;
  const premiumData = await database
    .select()
    .from(premium)
    .where(eq(premium.lemon_squeezy_customer_id, lemonSqueezyCustomerId));

  const premiumId = premiumData[0]?.id;

  if (!premiumId)
    throw new Error(
      `No User found for lemonSqueezyCustomerId: ${lemonSqueezyCustomerId}`
    );

  //renewal
  if (payload.meta.event_name === 'subscription_updated') {
    return await subscriptionUpdated({ payload, premiumId });
  }

  //cancellation
  if (payload.data.attributes.ends_at) {
    return await subscriptionCancelled({
      payload,
      premiumId,
      endsAt: payload.data.attributes.ends_at,
    });
  }

  return NextResponse.json({ ok: true });
};

// https://docs.lemonsqueezy.com/help/webhooks#signing-requests
// https://gist.github.com/amosbastian/e403e1d8ccf4f7153f7840dd11a85a69
async function getPayload(request: Request): Promise<Payload> {
  const env = keys();
  if (!env.LEMON_SQUEEZY_SIGNING_SECRET) {
    throw new Error('LEMON_SQUEEZY_SIGNING_SECRET is not set');
  }

  const text = await request.text();
  const hmac = crypto.createHmac('sha256', env.LEMON_SQUEEZY_SIGNING_SECRET);
  const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
  const signature = Buffer.from(
    request.headers.get('x-signature') as string,
    'utf8'
  );
  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error('Invalid signature');
  }

  const payload: Payload = JSON.parse(text);
  return payload;
}

function getTier({
  variantId,
}: { variantId: number }): 'PRO_MONTHLY' | 'PRO_ANNUALLY' | 'LIFETIME' {
  switch (variantId) {
    case env.NEXT_PUBLIC_PRO_MONTHLY_VARIANT_ID:
      return 'PRO_MONTHLY';
    case env.NEXT_PUBLIC_PRO_ANNUALLY_VARIANT_ID:
      return 'PRO_ANNUALLY';
    case env.NEXT_PUBLIC_LIFETIME_VARIANT_ID:
      return 'LIFETIME';
  }
  throw new Error(`Unknown variant id: ${variantId}`);
}

async function subscriptionCreated({
  payload,
  userId,
  organizationId,
}: { payload: Payload; userId: string; organizationId: string }) {
  console.log('===Subscription created', payload);
  if (!payload.data.attributes.renews_at)
    throw new Error('No renews_at provided');

  const lemonSqueezyRenewsAt = new Date(payload.data.attributes.renews_at);

  if (!payload.data.attributes.first_subscription_item)
    throw new Error('No subscription item');

  const upgradedPremium = await upgradeToPremium({
    userId,
    organizationId,
    tier: getTier({ variantId: payload.data.attributes.variant_id }),
    lemonSqueezyRenewsAt,
    lemonSqueezySubscriptionId:
      payload.data.attributes.first_subscription_item.subscription_id,
    lemonSqueezySubscriptionItemId:
      payload.data.attributes.first_subscription_item.id,
    lemonSqueezyOrderId: null,
    lemonSqueezyCustomerId: payload.data.attributes.customer_id,
    lemonSqueezyProductId: payload.data.attributes.product_id,
    lemonSqueezyVariantId: payload.data.attributes.variant_id,
  });

  //TODO: add posthog event
  const user = await getUserById(userId);

  if (user) {
    console.log('===User found', user.email);
    analytics.capture({
      distinctId: user.email!,
      event: 'Upgraded to premium',
      properties: {
        premiumTier: 'subscription',
        premium: true,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

async function lifetimeOrder({
  payload,
  userId,
  organizationId,
}: {
  payload: Payload;
  userId: string;
  organizationId: string;
}) {
  if (!payload.data.attributes.first_order_item)
    throw new Error('No order item');

  const updatedPremium = await upgradeToPremium({
    userId,
    organizationId,
    tier: 'LIFETIME',
    lemonSqueezyRenewsAt: null,
    lemonSqueezySubscriptionId: null,
    lemonSqueezySubscriptionItemId: null,
    lemonSqueezyOrderId: payload.data.attributes.first_order_item.order_id,
    lemonSqueezyCustomerId: payload.data.attributes.customer_id,
    lemonSqueezyProductId: payload.data.attributes.product_id,
    lemonSqueezyVariantId: payload.data.attributes.variant_id,
  });

  const user = await getUserById(userId);

  if (user) {
    console.log('===User found', user.email);
    analytics.capture({
      distinctId: user.email!,
      event: 'Upgraded to lifetime plan',
      properties: {
        premiumTier: 'lifetime',
        premium: true,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

async function subscriptionUpdated({
  payload,
  premiumId,
}: { payload: Payload; premiumId: string }) {
  console.log('===Subscription updated', payload);

  if (!payload.data.attributes.renews_at)
    throw new Error('No renews_at provided');

  const updatedPremium = await extendPremium({
    premiumId,
    lemonSqueezyRenewsAt: new Date(payload.data.attributes.renews_at),
  });

  const user = await getUserById(updatedPremium[0].userId!);

  if (user) {
    console.log('===User found', user.email);
    analytics.capture({
      distinctId: user.email!,
      event: 'Premium subscription payment success',
      properties: {
        premiumTier: 'subscription',
        premium: true,
      },
    });
  }

  return NextResponse.json({ ok: true });
}

async function subscriptionCancelled({
  payload,
  premiumId,
  endsAt,
}: {
  payload: Payload;
  premiumId: string;
  endsAt: NonNullable<Payload['data']['attributes']['ends_at']>;
}) {
  console.log('===Subscription cancelled', payload);

  const updatedPremium = await cancelPremium({
    premiumId,
    lemonSqueezyRenewsAt: new Date(endsAt),
  });

  const user = await getUserById(updatedPremium[0].userId!);

  if (user) {
    console.log('===User found', user.email);
    analytics.capture({
      distinctId: user.email!,
      event: 'Cancelled premium subscription',
      properties: {
        premiumCancelled: true,
        premium: false,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
