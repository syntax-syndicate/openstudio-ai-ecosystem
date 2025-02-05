import { isPremium } from '@/lib/utils/premium';
import { usePremiumQueries } from '@/services/premium/queries';

export function usePremium() {
  const { premiumQuery, extendPremiumMutation, cancelPremiumMutation, upgradeToPremiumMutation } =
    usePremiumQueries();

  const premium = !!(
    premiumQuery.data?.premium &&
    isPremium(premiumQuery.data.premium.lemon_squeezy_renews_at)
  )

  return {
    isPremium: premium,
    premium: premiumQuery.data?.premium,
    user: premiumQuery.data?.user,
    messagesCountPerMonth: premiumQuery.data?.messagesCountPerMonth,
  }
}
