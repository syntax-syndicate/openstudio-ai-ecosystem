import { createClient } from './server';

export async function getSession() {
  const client = await createClient();

  return client.auth.getSession();
}
