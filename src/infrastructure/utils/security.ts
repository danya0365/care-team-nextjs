import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'care-team-default-secret-change-me-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

/**
 * Security Utilities
 * Handles password hashing and JWT session tokens
 */
export const security = {
  /**
   * Hash a plain text password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * Compare a plain text password with a hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  /**
   * Sign a JWT token with user info
   */
  async signToken(payload: { userId: string; email: string }): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // 1 day session
      .sign(encodedSecret);
  },

  /**
   * Verify a JWT token and return payload
   */
  async verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    try {
      const { payload } = await jwtVerify(token, encodedSecret);
      return payload as { userId: string; email: string };
    } catch (error) {
      return null;
    }
  }
};
