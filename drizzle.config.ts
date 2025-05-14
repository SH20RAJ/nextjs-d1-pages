import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  // D1 specific configuration
  dbCredentials: {
    url: 'file:./local.db', // Local SQLite database for development
  },
} satisfies Config;
