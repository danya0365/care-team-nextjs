import { db } from '../../database/client';
import { authUsers, userProfiles, roles, authSessions } from '../../database/schema';
import { 
  AuthUser,
  AuthenticatedUser, 
  IAuthRepository,
  RegisterData
} from '@/src/application/repositories/IAuthRepository';
import { and, eq, gte } from 'drizzle-orm';
import { ISecurityService } from '@/src/application/services/ISecurityService';
import { IUserProfileRepository } from '@/src/application/repositories/IUserProfileRepository';

/**
 * DrizzleAuthRepository
 * Implementation of IAuthRepository using Drizzle ORM
 * Following Clean Architecture - Infrastructure layer
 */
export class DrizzleAuthRepository implements IAuthRepository {
  constructor(
    private security: ISecurityService,
    private profileRepository: IUserProfileRepository
  ) {}

  async register(data: RegisterData): Promise<AuthenticatedUser> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new Error('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const userId = crypto.randomUUID();
    const profileId = crypto.randomUUID();
    
    let passwordHash = null;
    if (data.password) {
      passwordHash = await this.security.hashPassword(data.password);
    }

    // Default to 'user' role for registration
    const defaultRoleId = 'user';

    await db.transaction(async (tx) => {
      await tx.insert(authUsers).values({
        id: userId,
        email: data.email,
        passwordHash,
      });

      await tx.insert(userProfiles).values({
        id: profileId,
        userId: userId,
        roleId: defaultRoleId,
        name: data.name,
      });
    });

    const profile = await this.profileRepository.getById(userId);
    if (!profile) throw new Error('เกิดข้อผิดพลาดในการสร้างโปรไฟล์');
    
    return profile;
  }

  async login(email: string, password: string): Promise<AuthenticatedUser | null> {
    const authUser = await this.findByEmail(email);
    if (!authUser || !authUser.passwordHash) return null;

    const isPasswordMatch = await this.security.comparePassword(password, authUser.passwordHash);
    if (!isPasswordMatch) return null;

    return this.profileRepository.getById(authUser.id);
  }

  private async findByEmail(email: string): Promise<AuthUser | null> {
    const result = await db
      .select()
      .from(authUsers)
      .where(eq(authUsers.email, email))
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

  async getCurrentUser(token?: string): Promise<AuthenticatedUser | null> {
    if (!token) return null;

    // Verify session exists in DB and is not expired
    const sessionResult = await db
      .select()
      .from(authSessions)
      .where(and(
        eq(authSessions.token, token),
        gte(authSessions.expiresAt, new Date())
      ))
      .limit(1);
    
    if (!sessionResult[0]) return null;

    const payload = await this.security.verifyToken<{ userId: string; email: string }>(token);
    if (!payload) return null;
    return this.profileRepository.getById(payload.userId);
  }

  async saveSession(userId: string, token: string, expiresAt: Date): Promise<void> {
    await db.insert(authSessions).values({
      id: crypto.randomUUID(),
      userId,
      token,
      expiresAt,
    });
  }

  async logout(token?: string): Promise<void> {
    if (!token) return;
    await db.delete(authSessions).where(eq(authSessions.token, token));
  }
}
