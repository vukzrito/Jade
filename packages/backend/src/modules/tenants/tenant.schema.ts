import { z } from 'zod';

export const updateTenantSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().optional(),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
