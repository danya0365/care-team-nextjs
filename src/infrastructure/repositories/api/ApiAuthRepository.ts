import {
  AuthenticatedUser,
  IAuthRepository,
  RegisterData
} from '@/src/application/repositories/IAuthRepository';

/**
 * ApiAuthRepository
 * Implementation of IAuthRepository using API endpoints
 * Suitable for client-side use
 */
export class ApiAuthRepository implements IAuthRepository {
  constructor() {}

  async register(data: RegisterData): Promise<AuthenticatedUser> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    return result.user as AuthenticatedUser;
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

  async getCurrentUser(token?: string): Promise<AuthenticatedUser | null> {
    try {
      // On the client, we don't need the token string because it's in the HttpOnly cookie.
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      const data = await response.json();
      return data.user as AuthenticatedUser;
    } catch (error) {
      console.error('Error fetching current user from API:', error);
      return null;
    }
  }

  async saveSession(userId: string, token: string, expiresAt: Date): Promise<void> {
    // Session saving is handled by the server during login
    // This is a no-op on the client side
  }

  async logout(token?: string): Promise<void> {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}
