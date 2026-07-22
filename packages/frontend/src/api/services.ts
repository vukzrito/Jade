import apiClient from './client';
import type { Service, Category, PaginatedResponse } from '../types';

export async function listServices(page = 1, limit = 50): Promise<PaginatedResponse<Service>> {
  const { data } = await apiClient.get('/services', { params: { page, limit } });
  return data;
}

export async function getAllServices(): Promise<Service[]> {
  const { data } = await apiClient.get('/services/all');
  return data;
}

export async function getService(id: string): Promise<Service> {
  const { data } = await apiClient.get(`/services/${id}`);
  return data;
}

export async function createService(input: Omit<Service, 'id' | 'tenantId' | 'category' | 'isActive'> & { isActive?: boolean }): Promise<Service> {
  const { data } = await apiClient.post('/services', input);
  return data;
}

export async function updateService(id: string, input: Partial<Omit<Service, 'id' | 'tenantId' | 'category'>>): Promise<Service> {
  const { data } = await apiClient.patch(`/services/${id}`, input);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  await apiClient.delete(`/services/${id}`);
}

export async function listCategories(): Promise<Category[]> {
  const { data } = await apiClient.get('/categories');
  return data;
}

export async function createCategory(input: { name: string; sortOrder?: number }): Promise<Category> {
  const { data } = await apiClient.post('/categories', input);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
