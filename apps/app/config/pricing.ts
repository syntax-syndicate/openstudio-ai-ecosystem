import { env } from '@/env';
import type { premiumTierEnum } from '@repo/backend/schema';

export const frequencies = [
  {
    value: 'monthly' as const,
    label: 'Monthly',
    priceSuffix: '/month',
  },
  {
    value: 'annually' as const,
    label: 'Annually',
    priceSuffix: '/month',
  },
];

export const pricing: Record<
  (typeof premiumTierEnum.enumValues)[number],
  number
> = {
  PRO_MONTHLY: 10,
  PRO_ANNUALLY: 8,
  LIFETIME: 249,
};

function discount(monthly: number, annually: number) {
  return ((monthly - annually) / monthly) * 100;
}

export const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: {
      monthly: '/chat',
      annually: '/chat',
    },
    description:
      'Free tier with 2 side by side assistants and 100 messages per month',
    features: [
      'Max 2 side by side assistants',
      '100 messages per month',
      'Bring your own api keys',
    ],
    cta: 'Get Started',
    mostPopular: false,
    hideFrequency: false,
    price: {
      monthly: 0,
      annually: 0,
    },
    discount: {
      monthly: 0,
      annually: 0,
    },
  },
  {
    name: 'Pro',
    tiers: {
      monthly: 'PRO_MONTHLY',
      annually: 'PRO_ANNUALLY',
    },
    href: {
      monthly: env.NEXT_PUBLIC_PRO_PAYMENT_LINK,
      annually: env.NEXT_PUBLIC_PRO_PAYMENT_LINK,
    },
    checkout: true,
    price: {
      monthly: pricing.PRO_MONTHLY,
      annually: pricing.PRO_ANNUALLY,
    },
    discount: {
      monthly: 0,
      annually: discount(pricing.PRO_MONTHLY, pricing.PRO_ANNUALLY),
    },
    description:
      'Pro tier with 2 side by side assistants and 500 messages per month',
    features: [
      'Max 2 side by side assistants',
      '500 messages per month',
      'No API key needed',
      'Access to new features well in advance',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    mostPopular: false,
    hideFrequency: false,
  },
];

export const lifetimeFeatures = [
  'All in free and pro tier',
  'Unlimited messages',
  'Access to new features well in advance',
  'Will Personally build features for you',
  'Priority support',
];
