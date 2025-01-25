import { Tinybird } from '@chronark/zod-bird';

if (!process.env.TINYBIRD_API_KEY) {
  throw new Error('TINYBIRD_API_KEY is not set');
}

export const tb = new Tinybird({
  token: process.env.TINYBIRD_API_KEY,
  baseUrl: process.env.TINYBIRD_API_URL,
});
