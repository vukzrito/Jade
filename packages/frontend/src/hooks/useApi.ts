import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as clientsApi from '../api/clients';
import * as servicesApi from '../api/services';
import * as appointmentsApi from '../api/appointments';
import * as tenantsApi from '../api/tenants';
import * as usersApi from '../api/users';
import type { Appointment } from '../types';

export function useTenant() {
  return useQuery({
    queryKey: ['tenant'],
    queryFn: tenantsApi.getTenant,
  });
}

export function useClients(page = 1) {
  return useQuery({
    queryKey: ['clients', page],
    queryFn: () => clientsApi.listClients(page),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientsApi.getClient(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof clientsApi.updateClient>[1]) =>
      clientsApi.updateClient(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clientsApi.deleteClient,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}

export function useServices(page = 1) {
  return useQuery({
    queryKey: ['services', page],
    queryFn: () => servicesApi.listServices(page),
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ['services', 'all'],
    queryFn: servicesApi.getAllServices,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: any) => servicesApi.updateService(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.deleteService,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: servicesApi.listCategories,
  });
}

export function useAppointments(query?: appointmentsApi.AppointmentQuery) {
  return useQuery({
    queryKey: ['appointments', query],
    queryFn: () => appointmentsApi.listAppointments(query),
  });
}

export function useAppointmentsByDate(date: string) {
  return useQuery({
    queryKey: ['appointments', 'date', date],
    queryFn: () => appointmentsApi.getAppointmentsByDate(date),
    enabled: !!date,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.createAppointment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: any) => appointmentsApi.updateAppointment(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: appointmentsApi.deleteAppointment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  });
}

// --- Users / Staff ---

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => usersApi.listUsers(page),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Parameters<typeof usersApi.updateUser>[1]) =>
      usersApi.updateUser(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

// --- Staff Revenue ---

export function useStaffRevenue(appointments: Appointment[] | undefined) {
  const revenueByStaff = new Map<string, { name: string; revenue: number }>();

  appointments?.forEach((apt) => {
    if (apt.status !== 'COMPLETED' || !apt.user || !apt.service) return;
    const existing = revenueByStaff.get(apt.user.id) ?? {
      name: `${apt.user.firstName} ${apt.user.lastName}`,
      revenue: 0,
    };
    existing.revenue += Number(apt.service.price);
    revenueByStaff.set(apt.user.id, existing);
  });

  return Array.from(revenueByStaff.values()).sort((a, b) => b.revenue - a.revenue);
}
