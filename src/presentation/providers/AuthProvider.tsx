'use client';

import { useEffect } from 'react';
import { getSessionAction } from '../actions/authActions';
import { useAuthStore } from '../stores/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuthData, setLoading } = useAuthStore();

  useEffect(() => {
    async function loadSession() {
      const sessionData = await getSessionAction();
      if (sessionData) {
        setAuthData({
          user: sessionData.user,
          activeProfile: sessionData.activeProfile,
        });
      } else {
        setAuthData({ user: null, activeProfile: null });
      }
      setLoading(false);
    }
    loadSession();
  }, [setAuthData, setLoading]);

  return <>{children}</>;
}
