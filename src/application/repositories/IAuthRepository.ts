export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  roleId: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser extends UserProfile {
  email: string;
  roleName: string;
}

export interface IAuthRepository {
  /**
   * Find an auth user by their email address
   */
  findByEmail(email: string): Promise<AuthUser | null>;

  /**
   * Get the profile for a specific user ID
   */
  getProfileByUserId(userId: string): Promise<AuthenticatedUser | null>;

  /**
   * Update a user's password
   */
  updatePassword(userId: string, passwordHash: string): Promise<void>;
}
