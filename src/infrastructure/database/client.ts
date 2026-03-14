import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

if (typeof window !== 'undefined') {
  throw new Error('🛡️ Security Error: Database client cannot be initialized in the browser.');
}

/**
 * Database client configuration
 * Falls back to local SQLite (file:local.db) if TURSO_CONNECTION_URL is missing
 */
const url = process.env.TURSO_CONNECTION_URL || 'file:local.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
export type DbClient = typeof db;
