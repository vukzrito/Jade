import apiClient from './client';
import type { Client, PaginatedResponse } from '../types';

export async function listClients(page = 1, limit = 20): Promise<PaginatedResponse<Client>> {
  const { data } = await apiClient.get('/clients', { params: { page, limit } });
  return data;
}

export async function getClient(id: string): Promise<Client> {
  const { data } = await apiClient.get(`/clients/${id}`);
  return data;
}

export async function createClient(input: Omit<Client, 'id' | 'tenantId' | 'createdAt' | 'notes'> & { notes?: string }): Promise<Client> {
  const { data } = await apiClient.post('/clients', input);
  return data;
}

export async function updateClient(id: string, input: Partial<Omit<Client, 'id' | 'tenantId' | 'createdAt'>>): Promise<Client> {
  const { data } = await apiClient.patch(`/clients/${id}`, input);
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  await apiClient.delete(`/clients/${id}`);
}

export async function searchClients(q: string): Promise<Client[]> {
  const { data } = await apiClient.get('/clients/search', { params: { q } });
  return data;
}
