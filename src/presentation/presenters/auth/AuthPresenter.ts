import { 
  IAuthRepository, 
  AuthenticatedUser,
  RegisterData 
} from '@/src/application/repositories/IAuthRepository';

export interface AuthViewModel {
  user: AuthenticatedUser | null;
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
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthenticatedUser> {
    try {
      return await this.authRepository.register(data);
    } catch (error: any) {
      console.error('Registration error in presenter:', error);
      throw error;
    }
  }

  /**
   * Attempt to login with email and password
   */
  async login(email: string, password: string): Promise<AuthenticatedUser | null> {
    try {
      const profile = await this.authRepository.login(email, password);
      if (!profile) {
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
      return profile;
    } catch (error: any) {
      console.error('Login error in presenter:', error);
      throw error;
    }
  }

  /**
   * Get the current authenticated user profile
   */
  async getCurrentUser(token?: string): Promise<AuthenticatedUser | null> {
    try {
      return await this.authRepository.getCurrentUser(token);
    } catch (error) {
      console.error('Error getting current user in presenter:', error);
      return null;
    }
  }

  /**
   * Save a new session to the database
   */
  async saveSession(userId: string, token: string, expiresAt: Date): Promise<void> {
    try {
      await this.authRepository.saveSession(userId, token, expiresAt);
    } catch (error) {
      console.error('Error saving session in presenter:', error);
      throw error;
    }
  }

  /**
   * Logout the user
   */
  async logout(token?: string): Promise<void> {
    try {
      await this.authRepository.logout(token);
    } catch (error) {
      console.error('Error logging out in presenter:', error);
      throw error;
    }
  }
}
