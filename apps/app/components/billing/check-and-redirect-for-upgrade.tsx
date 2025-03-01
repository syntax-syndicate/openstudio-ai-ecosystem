import { env } from '@/env';
import { redirect } from 'next/navigation';

export async function checkAndRedirectForUpgrade() {
  if (!env.NEXT_PUBLIC_WELCOME_UPGRADE_ENABLED) return;

  // const [data] = await trpc.user.getPremium.
  // const {premium} = data;

  // if(premium.lemon_squeezy_renews_at !== null) return;

  redirect('/welcome-upgrade');
}
