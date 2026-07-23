import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import type { Session } from '@supabase/supabase-js';
import apiClient from '../api/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (session) => {
    set({ session, isAuthenticated: !!session });
  },

  setUser: (user) => {
    set({ user });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        set({ session, isAuthenticated: true });
        const { data: profile } = await apiClient.get('/auth/profile');
        set({ user: profile });
      }
    } catch {
      set({ user: null, session: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));

supabase.auth.onAuthStateChange((_event, session) => {
  const { setSession } = useAuthStore.getState();
  setSession(session);
  if (!session) {
    useAuthStore.getState().setUser(null);
  }
});
