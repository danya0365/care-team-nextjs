import { db } from '../../database/client';
import { authUsers, userProfiles, roles } from '../../database/schema';
import { 
  AuthenticatedUser
} from '@/src/application/repositories/IAuthRepository';
import { IUserProfileRepository } from '@/src/application/repositories/IUserProfileRepository';
import { eq } from 'drizzle-orm';

/**
 * DrizzleUserProfileRepository
 * Implementation of IUserProfileRepository using Drizzle ORM
 * Following Clean Architecture - Infrastructure layer
 */
export class DrizzleUserProfileRepository implements IUserProfileRepository {
  async getById(userId: string): Promise<AuthenticatedUser | null> {
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

  async update(userId: string, data: Partial<AuthenticatedUser>): Promise<AuthenticatedUser> {
    // Basic update logic for profile data
    await db
      .update(userProfiles)
      .set({
        name: data.name,
        avatarUrl: data.avatarUrl,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId));

    const updated = await this.getById(userId);
    if (!updated) throw new Error('Failed to retrieve updated profile');
    return updated;
  }
}
