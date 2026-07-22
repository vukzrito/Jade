import { z } from 'zod';

export const updateFcmTokenSchema = z.object({
  token: z.string().min(1),
});

export const sendNotificationSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
  data: z.record(z.string()).optional(),
});
