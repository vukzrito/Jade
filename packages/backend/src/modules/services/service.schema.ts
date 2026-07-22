import { z } from 'zod';

export const createServiceSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().int().min(1),
  price: z.number().min(0),
});

export const updateServiceSchema = z.object({
  categoryId: z.string().optional().nullable(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  price: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
