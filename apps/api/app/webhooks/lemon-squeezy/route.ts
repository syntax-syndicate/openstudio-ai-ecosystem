import { Payload } from '@/types';
import { createClient } from '@repo/backend/auth/server';
import { keys } from '@repo/payments/keys';
import crypto from 'crypto';

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
async function getPayload(request: Request): Promise<Payload> {
  const env = keys();
  if (!env.LEMON_SQUEEZY_SIGNING_SECRET) {
    throw new Error('LEMON_SQUEEZY_SIGNING_SECRET is not set');
  }

  const text = await request.text();
  const hmac = crypto.createHmac('sha256', env.LEMON_SQUEEZY_SIGNING_SECRET);
  const digest = Buffer.from(hmac.update(text).digest('hex'), "utf8");
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
