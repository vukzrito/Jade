import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import * as authApi from '../api/auth';
import apiClient from '../api/client';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.session) {
        useAuthStore.getState().setSession(data.session);
      }

      const { data: profile } = await apiClient.get('/auth/profile');
      return profile;
    },
    onSuccess: (user) => {
      setUser(user);
      navigate('/');
    },
    onError: () => {},
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      tenantName?: string;
      phone?: string;
    }) => {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });
      if (signUpError) throw signUpError;

      const session = signUpData.session;
      if (!session) {
        throw new Error('Please check your email to confirm your account');
      }

      useAuthStore.getState().setSession(session);

      const result = await authApi.register({
        firstName: input.firstName,
        lastName: input.lastName,
        tenantName: input.tenantName,
        phone: input.phone,
      });
      return result;
    },
    onSuccess: (data) => {
      setUser(data.user);
      navigate('/');
    },
    onError: () => {},
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return async () => {
    await logout();
    navigate('/login');
  };
}
