import { defineConfig } from 'drizzle-kit';
import { keys } from './keys';

export default defineConfig({
  schema: './schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    database: 'postgres',
    port: 5432,
    host: keys().POSTGRES_DATABASE_HOST,
    user: keys().POSTGRES_DATABASE_USER,
    password: keys().POSTGRES_DATABASE_PASSWORD,
  },
});
