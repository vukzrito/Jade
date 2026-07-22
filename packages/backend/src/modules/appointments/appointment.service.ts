import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/pagination.js';
import type { CreateAppointmentInput, UpdateAppointmentInput, AppointmentQueryInput } from './appointment.schema.js';

export async function listAppointments(tenantId: string, query: AppointmentQueryInput) {
  const where: any = { tenantId };

  if (query.startDate) {
    where.startTime = { ...where.startTime, gte: new Date(query.startDate) };
  }
  if (query.endDate) {
    where.endTime = { ...where.endTime, lte: new Date(query.endDate) };
  }
  if (query.status) {
    where.status = query.status;
  }
  if (query.userId) {
    where.userId = query.userId;
  }

  const [data, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true, phone: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
        service: { select: { id: true, name: true, duration: true, price: true } },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: { startTime: 'desc' },
    }),
    prisma.appointment.count({ where }),
  ]);

  return paginatedResponse(data, total, { page: query.page, limit: query.limit });
}

export async function getAppointment(tenantId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, tenantId },
    include: {
      client: true,
      user: { select: { id: true, firstName: true, lastName: true } },
      service: true,
    },
  });
  if (!appointment) throw new NotFoundError('Appointment');
  return appointment;
}

export async function createAppointment(tenantId: string, input: CreateAppointmentInput) {
  return prisma.appointment.create({
    data: { ...input, tenantId },
    include: {
      client: { select: { id: true, firstName: true, lastName: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
      service: { select: { id: true, name: true, duration: true, price: true } },
    },
  });
}

export async function updateAppointment(tenantId: string, appointmentId: string, input: UpdateAppointmentInput) {
  const appointment = await prisma.appointment.findFirst({ where: { id: appointmentId, tenantId } });
  if (!appointment) throw new NotFoundError('Appointment');

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: input,
    include: {
      client: { select: { id: true, firstName: true, lastName: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
      service: { select: { id: true, name: true, duration: true, price: true } },
    },
  });
}

export async function deleteAppointment(tenantId: string, appointmentId: string) {
  const appointment = await prisma.appointment.findFirst({ where: { id: appointmentId, tenantId } });
  if (!appointment) throw new NotFoundError('Appointment');

  await prisma.appointment.delete({ where: { id: appointmentId } });
}

export async function getAppointmentsByDate(tenantId: string, date: string) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: {
      tenantId,
      startTime: { gte: dayStart },
      endTime: { lte: dayEnd },
    },
    include: {
      client: { select: { id: true, firstName: true, lastName: true, phone: true } },
      user: { select: { id: true, firstName: true, lastName: true } },
      service: { select: { id: true, name: true, duration: true, price: true } },
    },
    orderBy: { startTime: 'asc' },
  });
}
