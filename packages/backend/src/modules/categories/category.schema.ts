import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
