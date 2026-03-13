import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * Drizzle Config
 * Detects if it should use 'sqlite' (local file) or 'turso' (remote)
 */
const isLocal = !process.env.TURSO_CONNECTION_URL || process.env.TURSO_CONNECTION_URL.startsWith('file:');

export default defineConfig({
  schema: './src/infrastructure/database/schema.ts',
  out: './src/infrastructure/database/migrations',
  dialect: isLocal ? 'sqlite' : 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL || 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
});
