import type { premium } from '@repo/backend/schema';

export type Premium = typeof premium.$inferSelect;

export const isPremium = (lemonSqueezyRenewsAt?: Date | null): boolean => {
  return !!lemonSqueezyRenewsAt && new Date(lemonSqueezyRenewsAt) > new Date();
};

const getUserPlan = (
  lemonSqueezyRenewsAt?: Date | null
): 'PRO_MONTHLY' | 'PRO_ANNUALLY' | 'LIFETIME' | null => {
  if (!lemonSqueezyRenewsAt) {
    return null;
  }

  const renewsAt = new Date(lemonSqueezyRenewsAt);

  // if renewsAt is 5 years in the future, return LIFETIME
  if (renewsAt.getFullYear() - new Date().getFullYear() >= 5) {
    return 'LIFETIME';
  }

  // if renewsAt is more than 6 months in the future, return PRO_ANNUALLY
  if (renewsAt.getFullYear() > new Date().getFullYear() + 1) {
    return 'PRO_ANNUALLY';
  }

  // if renewsAt is less than 6 months in the future, return PRO_MONTHLY
  if (renewsAt > new Date(new Date().setMonth(new Date().getMonth() + 6))) {
    return 'PRO_MONTHLY';
  }

  return 'PRO_MONTHLY';
};

export const getUserTier = (
  premium?: Pick<Premium, 'lemon_squeezy_renews_at' | 'tier'> | null
) => {
  return premium?.tier || getUserPlan(premium?.lemon_squeezy_renews_at);
};

export function isOnHigherTier(
  tier1: 'PRO_MONTHLY' | 'PRO_ANNUALLY' | 'LIFETIME' | null,
  tier2: 'PRO_MONTHLY' | 'PRO_ANNUALLY' | 'LIFETIME' | null
): boolean {
  const tierRanking = {
    PRO_MONTHLY: 1,
    PRO_ANNUALLY: 2,
    LIFETIME: 3,
  };

  const tier1Rank = tier1 ? tierRanking[tier1] : 0;
  const tier2Rank = tier2 ? tierRanking[tier2] : 0;

  return tier1Rank > tier2Rank;
}
