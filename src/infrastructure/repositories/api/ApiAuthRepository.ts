import { 
  AuthUser, 
  AuthenticatedUser, 
  IAuthRepository 
} from '@/src/application/repositories/IAuthRepository';

/**
 * ApiAuthRepository
 * Implementation of IAuthRepository using API endpoints
 * Suitable for client-side use
 */
export class ApiAuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    // This is typically not needed on the client for security reasons
    // but we implement it for interface compatibility
    throw new Error('findByEmail is not supported on the client side API repository.');
  }

  async getProfileByUserId(userId: string): Promise<AuthenticatedUser | null> {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      const data = await response.json();
      return data.user as AuthenticatedUser;
    } catch (error) {
      console.error('Error fetching profile from API:', error);
      return null;
    }
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    // Client side password update should use a specific API route
    // that doesn't accept hashes, but we keep the interface for now
    throw new Error('Direct password hash update is not supported on the client side.');
  }

  /**
   * Special method for login since it's the primary way client gets auth data
   */
  async login(email: string, password: string): Promise<AuthenticatedUser | null> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    return data.user as AuthenticatedUser;
  }
}

export const apiAuthRepository = new ApiAuthRepository();
