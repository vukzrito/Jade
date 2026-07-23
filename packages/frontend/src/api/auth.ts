import apiClient from './client';
import type { User } from '../types';

export async function register(input: {
  firstName: string;
  lastName: string;
  tenantName?: string;
  tenantSlug?: string;
  phone?: string;
}): Promise<{ user: User }> {
  const { data } = await apiClient.post('/auth/register', input);
  return data;
}

export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get('/auth/profile');
  return data;
}
