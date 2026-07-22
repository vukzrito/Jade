import apiClient from './client';
import type { Tenant } from '../types';

export async function getTenant(): Promise<Tenant> {
  const { data } = await apiClient.get('/tenants');
  return data;
}

export async function updateTenant(input: Partial<Tenant>): Promise<Tenant> {
  const { data } = await apiClient.patch('/tenants', input);
  return data;
}
