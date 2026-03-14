import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { ISecurityService } from '@/src/application/services/ISecurityService';

const JWT_SECRET = process.env.JWT_SECRET || 'care-team-default-secret-change-me-in-production';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

/**
 * JwtSecurityService
 * Implementation of ISecurityService using bcrypt and jose
 * Following Clean Architecture - Infrastructure layer
 */
export class JwtSecurityService implements ISecurityService {
  /**
   * Hash a plain text password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare a plain text password with a hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Sign a JWT token with user info
   */
  async signToken(payload: { userId: string; email: string }): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // 1 day session
      .sign(encodedSecret);
  }

  /**
   * Verify a JWT token and return payload
   */
  async verifyToken<T = { userId: string; email: string }>(token: string): Promise<T | null> {
    try {
      const { payload } = await jwtVerify(token, encodedSecret);
      return payload as T;
    } catch (error) {
      return null;
    }
  }
}
