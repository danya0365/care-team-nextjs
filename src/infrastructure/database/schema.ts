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
 * Events table (กิจกรรม)
 */
export const events = sqliteTable('events', {
  id: text('id').primaryKey(), // slug or UUID
  title: text('title').notNull(),
  description: text('description'),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  ...timestamps,
});

/**
 * Registrations table
 * For PWID, MSM, Sex Worker, etc.
 */
export const registrations = sqliteTable('registrations', {
  id: text('id').primaryKey(), // UUID
  eventId: text('event_id').references(() => events.id),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  targetGroup: text('target_group').notNull(), // PWID, MSM, SW, Other
  address: text('address'),
  note: text('note'),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  ...timestamps,
});
