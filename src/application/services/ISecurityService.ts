/**
 * ISecurityService
 * Interface for security-related operations like password hashing and token management
 * Following Clean Architecture - Application layer
 */
export interface ISecurityService {
  /**
   * Hash a plain text password
   */
  hashPassword(password: string): Promise<string>;

  /**
   * Compare a plain text password with a hash
   */
  comparePassword(password: string, hash: string): Promise<boolean>;

  /**
   * Sign a JWT token with user info
   */
  signToken(payload: { userId: string; email: string }): Promise<string>;

  /**
   * Verify a JWT token and return payload
   */
  verifyToken<T = { userId: string; email: string }>(token: string): Promise<T | null>;
}
