//TODO: Fix this at any cost
// import 'server-only';

import { neon } from '@neondatabase/serverless';
import { keys } from '@repo/database/keys';
import { drizzle } from 'drizzle-orm/neon-http';

const client = neon(keys().NEXT_PUBLIC_DATABASE_URL);

export const database = drizzle({ client });
