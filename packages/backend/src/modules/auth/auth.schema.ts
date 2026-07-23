import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  tenantSlug: z.string().min(1).optional(),
  tenantName: z.string().min(1).optional(),
  phone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
