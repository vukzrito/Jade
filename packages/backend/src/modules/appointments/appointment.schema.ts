import { z } from 'zod';

export const createAppointmentSchema = z.object({
  clientId: z.string(),
  userId: z.string(),
  serviceIds: z.array(z.string()).min(1, 'At least one service is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  notes: z.string().optional(),
});

export const appointmentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
});

export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['CASH', 'CARD', 'TRANSFER', 'OTHER']).default('CASH'),
  status: z.enum(['PAID', 'PARTIAL', 'PENDING']).default('PAID'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type AppointmentQueryInput = z.infer<typeof appointmentQuerySchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
