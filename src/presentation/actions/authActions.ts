'use server';

import { cookies } from 'next/headers';
import { security } from '@/src/infrastructure/utils/security';
import { drizzleAuthRepository } from '@/src/infrastructure/repositories/drizzle/DrizzleAuthRepository';

/**
 * Server Action to retrieve the current session data
 * including user info and active profile/role
 */
export async function getSessionAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    
    if (!token) return null;

    const payload = await security.verifyToken(token);
    if (!payload || !payload.userId) return null;

    const profile = await drizzleAuthRepository.getProfileByUserId(payload.userId);
    if (!profile) return null;

    return {
      user: {
        id: payload.userId,
        email: payload.email,
      },
      activeProfile: profile,
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Server Action to securely logout the user
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
