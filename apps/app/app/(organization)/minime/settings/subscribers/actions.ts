'use server';

import { deleteSubscriber as deleteSub } from '@/actions/subscribers';
import { currentUser, updateUserNewsletter } from '@repo/backend/auth/utils';
import { revalidatePath } from 'next/cache';

export async function newsletterToggle(prev: any, data: FormData) {
  const toggle = data.get('newsletter') === 'on';
  const user = await currentUser();
  if (!user) {
    return {
      error: 'User not found',
    };
  }
  await updateUserNewsletter(user.id, toggle);

  revalidatePath('/minime/settings/subscribers');
  return {
    status: toggle ? 'on' : 'off',
  };
}

export async function deleteSubscriber(prev: any, data: FormData) {
  try {
    const subId = data.get('subId') as string;
    const user = await currentUser();
    if (!user) {
      return {
        error: 'User not found',
      };
    }
    if (!subId) {
      return { error: 'Subscriber not found' };
    }

    await deleteSub(subId, user.id);

    revalidatePath('/minime/settings/subscribers');

    return {
      status: 'Deleted',
    };
  } catch (err) {
    return {
      error: 'Error',
    };
  }
}
