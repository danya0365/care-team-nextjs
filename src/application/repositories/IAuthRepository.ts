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

export interface RegisterData {
  email: string;
  name: string;
  password?: string;
}

export interface IAuthRepository {
  /**
   * Register a new user
   */
  register(data: RegisterData): Promise<AuthenticatedUser>;

  /**
   * Update a user's password
   */
  updatePassword(userId: string, passwordHash: string): Promise<void>;

  /**
   * Login with email and password
   * Returns the authenticated user profile
   */
  login(email: string, password: string): Promise<AuthenticatedUser | null>;

  /**
   * Get the current authenticated user profile
   * On server, this uses the token. On client, it can fetch from API.
   */
  getCurrentUser(token?: string): Promise<AuthenticatedUser | null>;

  /**
   * Save a new session token to the database
   */
  saveSession(userId: string, token: string, expiresAt: Date): Promise<void>;

  /**
   * Logout the user by invalidating their session token
   */
  logout(token?: string): Promise<void>;
}
