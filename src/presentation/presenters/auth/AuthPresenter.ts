import { IAuthRepository } from '@/src/application/repositories/IAuthRepository';
import { security } from '@/src/infrastructure/utils/security';

export interface AuthViewModel {
  user: {
    id: string;
    email: string;
    name: string;
    roleName: string;
    avatarUrl: string | null;
  } | null;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * AuthPresenter
 * Handles the logic for user authentication following Clean Architecture
 */
export class AuthPresenter {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Attempt to login with email and password
   * Returns a session token if successful
   */
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const authUser = await this.authRepository.findByEmail(email);

    if (!authUser || !authUser.passwordHash) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const isPasswordMatch = await security.comparePassword(password, authUser.passwordHash);
    if (!isPasswordMatch) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const profile = await this.authRepository.getProfileByUserId(authUser.id);
    if (!profile) {
      throw new Error('ไม่พบข้อมูลโปรไฟล์ผู้ใช้งาน');
    }

    const token = await security.signToken({
      userId: authUser.id,
      email: authUser.email
    });

    return { token, user: profile };
  }

  /**
   * Get the current authenticated user profile
   */
  async getCurrentUser(token: string): Promise<any> {
    const payload = await security.verifyToken(token);
    if (!payload) return null;

    return this.authRepository.getProfileByUserId(payload.userId);
  }
}
