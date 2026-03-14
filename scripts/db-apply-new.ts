import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../src/infrastructure/database/client';
import { sql } from 'drizzle-orm';

async function applyNewTables() {
  console.log('🚀 Applying new tables to Turso...');
  console.log('🔗 Connection URL:', process.env.TURSO_CONNECTION_URL || 'file:local.db');

  const statements = [
    `CREATE TABLE IF NOT EXISTS "auth_users" (
      "id" text PRIMARY KEY NOT NULL,
      "email" text NOT NULL,
      "password_hash" text,
      "created_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL,
      "updated_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "auth_users_email_unique" ON "auth_users" ("email")`,
    `CREATE TABLE IF NOT EXISTS "roles" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "description" text,
      "created_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL,
      "updated_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS "user_profiles" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL,
      "role_id" text NOT NULL,
      "name" text NOT NULL,
      "avatar_url" text,
      "created_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL,
      "updated_at" integer DEFAULT (strftime('%s', 'now')) NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "auth_users"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON UPDATE no action ON DELETE no action
    )`,
    `CREATE TABLE IF NOT EXISTS "permissions" (
      "id" text PRIMARY KEY NOT NULL,
      "action" text NOT NULL,
      "resource" text NOT NULL,
      "description" text
    )`,
    `CREATE TABLE IF NOT EXISTS "role_permissions" (
      "role_id" text NOT NULL,
      "permission_id" text NOT NULL,
      PRIMARY KEY("role_id", "permission_id"),
      FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON UPDATE no action ON DELETE cascade
    )`,
    `CREATE TABLE IF NOT EXISTS "profile_permissions" (
      "profile_id" text NOT NULL,
      "permission_id" text NOT NULL,
      "is_granted" integer NOT NULL,
      PRIMARY KEY("profile_id", "permission_id"),
      FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON UPDATE no action ON DELETE cascade,
      FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON UPDATE no action ON DELETE cascade
    )`
  ];

  for (const statement of statements) {
    try {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await db.run(sql.raw(statement));
      console.log('✅ Success');
    } catch (e: any) {
      if (e.message.includes('already exists')) {
        console.log('ℹ️ Table/Index already exists, skipping.');
      } else {
        console.error('❌ Failed:', e.message);
      }
    }
  }

  console.log('🚀 Applying Alter Table for registrations...');
  try {
    await db.run(sql.raw(`ALTER TABLE "registrations" ADD COLUMN "event_id" text REFERENCES events(id)`));
    console.log('✅ Alter Table success');
  } catch (e: any) {
    console.log('ℹ️ Alter table failed or already applied:', e.message);
  }

  process.exit(0);
}

applyNewTables().catch(e => {
  console.error(e);
  process.exit(1);
});
