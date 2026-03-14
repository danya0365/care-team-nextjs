'use server';

import { cookies } from 'next/headers';
import { createServerAuthPresenter } from '@/src/presentation/presenters/auth/AuthPresenterServerFactory';

/**
 * Server Action to retrieve the current session data
 * including user info and active profile/role
 */
export async function getSessionAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    
    if (!token) return null;

    const presenter = createServerAuthPresenter();
    const profile = await presenter.getCurrentUser(token);
    
    if (!profile) return null;

    return {
      user: {
        id: profile.userId,
        email: profile.email,
        name: profile.name,
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
