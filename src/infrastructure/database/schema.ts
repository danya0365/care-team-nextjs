import { sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Common timestamps
 */
const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
};

/**
 * 1. Auth Users
 * Internal credentials and authentication state
 */
export const authUsers = sqliteTable('auth_users', {
  id: text('id').primaryKey(), // UUID
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  ...timestamps,
});

/**
 * 2. Auth Sessions
 * Track active user sessions for server-side invalidation
 */
export const authSessions = sqliteTable('auth_sessions', {
  id: text('id').primaryKey(), // UUID or session token
  userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  ...timestamps,
});

/**
 * 2. Roles
 * Group-level identity (e.g., admin, manager, member)
 */
export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(), // e.g., 'admin', 'user', 'manager'
  name: text('name').notNull(),
  description: text('description'),
  ...timestamps,
});

/**
 * 3. User Profiles
 * Public-facing identity linked to Auth and Roles
 */
export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(), // UUID
  userId: text('user_id').notNull().references(() => authUsers.id, { onDelete: 'cascade' }),
  roleId: text('role_id').notNull().references(() => roles.id),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  ...timestamps,
});

/**
 * 4. Permissions Definition
 * Atomic actions allowed in the system
 */
export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(), // e.g., 'create:event', 'delete:registration'
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  description: text('description'),
});

/**
 * 5. Role Permissions (Mapping)
 */
export const rolePermissions = sqliteTable('role_permissions', {
  roleId: text('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: text('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.roleId, table.permissionId] }),
]);

/**
 * 6. Profile Permissions (Overrides)
 */
export const profilePermissions = sqliteTable('profile_permissions', {
  profileId: text('profile_id').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
  permissionId: text('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
  isGranted: integer('is_granted', { mode: 'boolean' }).notNull(), // true = Grant, false = Deny
}, (table) => [
  primaryKey({ columns: [table.profileId, table.permissionId] }),
]);

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
  nickname: text('nickname'),
  email: text('email'),
  phone: text('phone').notNull(),
  address: text('address'),
  dateOfBirth: text('date_of_birth'),
  requestNeedles: integer('request_needles', { mode: 'boolean' }).notNull().default(false),
  condomSize: text('condom_size'),
  requestHivTest: integer('request_hiv_test', { mode: 'boolean' }).notNull().default(false),
  substanceAbuseHistory: text('substance_abuse_history'),
  note: text('note'),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  ...timestamps,
});
