import apiClient from './client';
import type { User, PaginatedResponse } from '../types';

export async function listUsers(page = 1, limit = 50): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get('/users', { params: { page, limit } });
  return data;
}

export async function createUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'STAFF';
  phone?: string;
}): Promise<User> {
  const { data } = await apiClient.post('/users', input);
  return data;
}

export async function updateUser(id: string, input: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
}): Promise<User> {
  const { data } = await apiClient.patch(`/users/${id}`, input);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
