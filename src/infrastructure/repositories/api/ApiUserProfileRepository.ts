import { AuthenticatedUser } from '@/src/application/repositories/IAuthRepository';
import { IUserProfileRepository } from '@/src/application/repositories/IUserProfileRepository';

/**
 * ApiUserProfileRepository
 * Implementation of IUserProfileRepository using API endpoints
 * Suitable for client-side use
 */
export class ApiUserProfileRepository implements IUserProfileRepository {
  async getById(userId: string): Promise<AuthenticatedUser | null> {
    try {
      // In the current API design, /api/auth/me returns the current session profile
      // ignoring the userId if provided as '' or same as current.
      // For viewing other users, we would need a different endpoint like /api/users/[id]
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      const data = await response.json();
      return data.user as AuthenticatedUser;
    } catch (error) {
      console.error('Error fetching profile from API:', error);
      return null;
    }
  }

  async update(userId: string, data: Partial<AuthenticatedUser>): Promise<AuthenticatedUser> {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    const updated = await response.json();
    return updated.user as AuthenticatedUser;
  }
}
