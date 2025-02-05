import { useMutation, useQuery } from '@tanstack/react-query';
import {
  cancelPremium,
  extendPremium,
  getPremium,
  upgradeToPremium,
} from './client';

export const usePremiumQueries = () => {
  const premiumQuery = useQuery({
    queryKey: ['premium'],
    queryFn: () => getPremium(),
  });

  const extendPremiumMutation = useMutation({
    mutationFn: (options: {
      premiumId: string;
      lemonSqueezyRenewsAt: Date | null;
    }) => extendPremium(options),
    onSuccess: () => {
      premiumQuery.refetch();
    },
  });

  const cancelPremiumMutation = useMutation({
    mutationFn: (options: {
      premiumId: string;
      lemonSqueezyRenewsAt: Date;
    }) => cancelPremium(options),
    onSuccess: () => {
      premiumQuery.refetch();
    },
  });

  const upgradeToPremiumMutation = useMutation({
    mutationFn: (options: {
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
    }) => upgradeToPremium(options),
    onSuccess: () => {
      premiumQuery.refetch();
    },
  });

  return {
    premiumQuery,
    extendPremiumMutation,
    cancelPremiumMutation,
    upgradeToPremiumMutation,
  };
};
