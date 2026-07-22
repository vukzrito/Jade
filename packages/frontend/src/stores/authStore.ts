import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('jade_token'),
  isAuthenticated: !!localStorage.getItem('jade_token'),

  setAuth: (user, token) => {
    localStorage.setItem('jade_token', token);
    set({ user, token, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('jade_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
