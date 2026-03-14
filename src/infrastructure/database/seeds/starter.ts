import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sql, eq } from 'drizzle-orm';
import { db } from '../client';
import { authUsers, permissions, rolePermissions, roles, userProfiles } from '../schema';

async function seedStarter() {
  console.log('🌱 Starting Seeding process...');
  console.log('🔗 Connection URL:', process.env.TURSO_CONNECTION_URL || 'file:local.db');

  try {
    // 0. Diagnostic: Check tables
    const tablesResult = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table'`);
    const existingTables = tablesResult.rows.map(r => String(r.name));
    console.log('📋 Existing Tables in DB:', existingTables);

    if (!existingTables.includes('roles')) {
      console.error('❌ CRITICAL: "roles" table not found in database!');
      process.exit(1);
    }

    // 1. Insert Core Roles
    console.log('👥 Seeding Roles...');
    const rolesData = [
      { id: 'admin', name: 'Administrator', description: 'Full access to all system features.' },
      { id: 'manager', name: 'Manager', description: 'Can manage events and oversee registrations.' },
      { id: 'staff', name: 'Staff', description: 'Can create and manage registrations.' },
      { id: 'viewer', name: 'Viewer', description: 'Read-only access to reports and data.' },
    ];
    await db.insert(roles).values(rolesData).onConflictDoNothing();
    console.log('✅ Roles seeded');

    // 2. Insert Core Permissions
    console.log('🔐 Seeding Permissions...');
    const permissionsData = [
      { id: 'create:event', action: 'create', resource: 'event', description: 'สร้างกิจกรรมใหม่' },
      { id: 'edit:event', action: 'edit', resource: 'event', description: 'แก้ไขข้อมูลกิจกรรม' },
      { id: 'delete:event', action: 'delete', resource: 'event', description: 'ลบกิจกรรม' },
      { id: 'view:event', action: 'view', resource: 'event', description: 'ดูกิจกรรมทั้งหมด' },
      { id: 'create:registration', action: 'create', resource: 'registration', description: 'เพิ่มข้อมูลการลงทะเบียน' },
      { id: 'edit:registration', action: 'edit', resource: 'registration', description: 'แก้ไขข้อมูลการลงทะเบียน' },
      { id: 'delete:registration', action: 'delete', resource: 'registration', description: 'ลบข้อมูลการลงทะเบียน' },
      { id: 'view:registration', action: 'view', resource: 'registration', description: 'ดูข้อมูลการลงทะเบียนทั้งหมด' },
      { id: 'approve:registration', action: 'approve', resource: 'registration', description: 'อนุมัติการลงทะเบียน' },
    ];
    await db.insert(permissions).values(permissionsData).onConflictDoNothing();
    console.log('✅ Permissions seeded');

    // 3. Map Roles to Permissions
    console.log('🔗 Mapping Role-Permissions...');
    const adminPermissions = permissionsData.map(p => ({ roleId: 'admin', permissionId: p.id }));
    const managerPermissions = [
      'create:event', 'edit:event', 'view:event',
      'create:registration', 'edit:registration', 'view:registration', 'approve:registration'
    ].map(pId => ({ roleId: 'manager', permissionId: pId }));
    const staffPermissions = [
      'view:event', 'create:registration', 'edit:registration', 'view:registration'
    ].map(pId => ({ roleId: 'staff', permissionId: pId }));
    const viewerPermissions = ['view:event', 'view:registration'].map(pId => ({ roleId: 'viewer', permissionId: pId }));

    const allRolePermissions = [...adminPermissions, ...managerPermissions, ...staffPermissions, ...viewerPermissions];
    await db.insert(rolePermissions).values(allRolePermissions).onConflictDoNothing();
    console.log('✅ Role-Permissions mapping seeded');

    // 4. Create Default Admin User
    console.log('👤 Checking default admin user...');
    const adminEmail = 'admin@careteam.com';
    
    const existing = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, adminEmail))
      .limit(1);

    if (existing.length === 0) {
      console.log('✨ Creating new admin user...');
      const adminId = uuidv4();
      const passwordHash = await bcrypt.hash('admin1234', 10);
      await db.insert(authUsers).values({
        id: adminId,
        email: adminEmail,
        passwordHash: passwordHash,
      });
      await db.insert(userProfiles).values({
        id: uuidv4(),
        userId: adminId,
        roleId: 'admin',
        name: 'Care Team Administrator',
      });
      console.log('✅ Default admin user created (admin@careteam.com / admin1234)');
    } else {
      console.log('ℹ️ Admin user already exists, skipping creation.');
    }

    console.log('🚀 Starter seed successfully completed!');
    process.exit(0);
  } catch (e: any) {
    console.error('❌ Seeding failed with error:', e.message);
    if (e.cause) console.error('🔍 Cause:', e.cause.message);
    process.exit(1);
  }
}

seedStarter();
