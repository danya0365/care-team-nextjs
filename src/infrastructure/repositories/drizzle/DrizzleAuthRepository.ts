import { db } from '../../database/client';
import { authUsers, userProfiles, roles } from '../../database/schema';
import { 
  AuthUser, 
  AuthenticatedUser, 
  IAuthRepository 
} from '@/src/application/repositories/IAuthRepository';
import { eq } from 'drizzle-orm';

/**
 * DrizzleAuthRepository
 * Implementation of IAuthRepository using Drizzle ORM
 * Following Clean Architecture - Infrastructure layer
 */
export class DrizzleAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const result = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email))
      .limit(1);

    return result[0] || null;
  }

  async getProfileByUserId(userId: string): Promise<AuthenticatedUser | null> {
    const result = await db
      .select({
        id: userProfiles.id,
        userId: userProfiles.userId,
        roleId: userProfiles.roleId,
        name: userProfiles.name,
        avatarUrl: userProfiles.avatarUrl,
        createdAt: userProfiles.createdAt,
        updatedAt: userProfiles.updatedAt,
        email: authUsers.email,
        roleName: roles.name,
      })
      .from(userProfiles)
      .innerJoin(authUsers, eq(userProfiles.userId, authUsers.id))
      .innerJoin(roles, eq(userProfiles.roleId, roles.id))
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db
      .update(authUsers)
      .set({ 
        passwordHash,
        updatedAt: new Date()
      })
      .where(eq(authUsers.id, userId));
  }
}

export const drizzleAuthRepository = new DrizzleAuthRepository();
