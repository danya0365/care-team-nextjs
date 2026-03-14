import { useState, useCallback, useEffect } from 'react';
import { AuthViewModel } from './AuthPresenter';
import { apiAuthRepository } from '@/src/infrastructure/repositories/api/ApiAuthRepository';
import { logoutAction } from '@/src/presentation/actions/authActions';

export function useAuthPresenter() {
  const [state, setState] = useState<AuthViewModel>({
    user: null,
    authenticated: false,
    loading: true,
    error: null,
  });

  const checkSession = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const profile = await apiAuthRepository.getProfileByUserId(''); // API route ignores the ID and returns current session
      if (profile) {
        setState({
          user: profile,
          authenticated: true,
          loading: false,
          error: null,
        });
      } else {
        setState(s => ({ ...s, authenticated: false, user: null, loading: false }));
      }
    } catch (error) {
      setState(s => ({ ...s, authenticated: false, user: null, loading: false }));
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const profile = await apiAuthRepository.login(email, password);

      if (profile) {
        setState({
          user: profile,
          authenticated: true,
          loading: false,
          error: null,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      setState(s => ({
        ...s,
        loading: false,
        error: error.message,
      }));
      return false;
    }
  };

  const logout = async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      await logoutAction(); // Use server action
      setState({
        user: null,
        authenticated: false,
        loading: false,
        error: null,
      });
      window.location.href = '/login';
    } catch (error) {
      setState(s => ({ ...s, loading: false }));
    }
  };

  return {
    state,
    actions: {
      login,
      logout,
      checkSession,
      clearError: () => setState(s => ({ ...s, error: null })),
    },
  };
}
