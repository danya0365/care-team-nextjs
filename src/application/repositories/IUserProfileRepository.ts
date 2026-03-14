import { AuthenticatedUser } from './IAuthRepository';

/**
 * IUserProfileRepository
 * Interface for managing user profiles and identity data
 * Following Clean Architecture - Application layer
 */
export interface IUserProfileRepository {
  /**
   * Get a user profile by their unique ID
   * This can be used to view the current user's profile or another user's profile
   */
  getById(userId: string): Promise<AuthenticatedUser | null>;
  
  /**
   * Update a user's profile data
   */
  update(userId: string, data: Partial<AuthenticatedUser>): Promise<AuthenticatedUser>;
}
