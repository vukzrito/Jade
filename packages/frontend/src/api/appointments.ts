import apiClient from './client';
import type { Appointment, PaginatedResponse, Payment } from '../types';

export interface AppointmentQuery {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
  userId?: string;
}

export async function listAppointments(query?: AppointmentQuery): Promise<PaginatedResponse<Appointment>> {
  const { data } = await apiClient.get('/appointments', { params: query });
  return data;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const { data } = await apiClient.get(`/appointments/${id}`);
  return data;
}

export async function createAppointment(input: {
  clientId: string;
  userId: string;
  serviceIds: string[];
  startTime: string;
  endTime: string;
  notes?: string;
}): Promise<Appointment> {
  const { data } = await apiClient.post('/appointments', input);
  return data;
}

export async function updateAppointment(id: string, input: Partial<Appointment>): Promise<Appointment> {
  const { data } = await apiClient.patch(`/appointments/${id}`, input);
  return data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await apiClient.delete(`/appointments/${id}`);
}

export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  const { data } = await apiClient.get('/appointments/date', { params: { date } });
  return data;
}

export async function getClientAppointments(clientId: string): Promise<Appointment[]> {
  const { data } = await apiClient.get(`/appointments/client/${clientId}`);
  return data;
}

export async function getAppointmentPayments(appointmentId: string): Promise<Payment[]> {
  const { data } = await apiClient.get(`/appointments/${appointmentId}/payments`);
  return data;
}

export async function createPayment(appointmentId: string, input: {
  amount: number;
  method?: 'CASH' | 'CARD' | 'TRANSFER' | 'OTHER';
  status?: 'PAID' | 'PARTIAL' | 'PENDING';
}): Promise<Payment> {
  const { data } = await apiClient.post(`/appointments/${appointmentId}/payments`, input);
  return data;
}
