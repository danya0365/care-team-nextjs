import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Common timestamps
 */
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
};

/**
 * Registrations table
 * For PWID, MSM, Sex Worker, etc.
 */
export const registrations = sqliteTable('registrations', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  targetGroup: text('target_group').notNull(), // PWID, MSM, SW, Other
  address: text('address'),
  note: text('note'),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  ...timestamps,
});
