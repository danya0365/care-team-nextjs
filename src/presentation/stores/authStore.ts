import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthenticatedUser {
  id: string;
  userId: string;
  roleId: string;
  name: string;
  avatarUrl: string | null;
  email: string;
  roleName: string;
}

interface AuthState {
  user: { id: string; email: string } | null;
  activeProfile: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthData: (data: { user: { id: string; email: string } | null; activeProfile: AuthenticatedUser | null }) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      activeProfile: null,
      isAuthenticated: false,
      isLoading: true,
      setAuthData: (data) => set({
        user: data.user,
        activeProfile: data.activeProfile,
        isAuthenticated: !!data.user,
        isLoading: false,
      }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ 
        user: null, 
        activeProfile: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
    }),
    {
      name: 'care-team-auth-storage',
    }
  )
);
