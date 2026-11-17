import { z } from 'zod';

export const redeemRewardSchema = z.object({
  clientId: z.string(),
  serviceId: z.string(),
  appointmentId: z.string().optional(),
});

export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;
