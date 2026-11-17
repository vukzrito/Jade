import apiClient from './client';
import type { ClientLoyalty, RedeemedReward } from '../types';

export async function getClientLoyalty(clientId: string): Promise<ClientLoyalty> {
  const { data } = await apiClient.get(`/loyalty/client/${clientId}`);
  return data;
}

export async function redeemReward(input: {
  clientId: string;
  serviceId: string;
  appointmentId?: string;
}): Promise<RedeemedReward> {
  const { data } = await apiClient.post('/loyalty/redeem', input);
  return data;
}
