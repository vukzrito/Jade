import apiClient from './client';
import type { AuthResponse, User } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
}

export async function register(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantName?: string;
  tenantSlug?: string;
  phone?: string;
}): Promise<AuthResponse> {
  const { data } = await apiClient.post('/auth/register', input);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get('/auth/profile');
  return data;
}
