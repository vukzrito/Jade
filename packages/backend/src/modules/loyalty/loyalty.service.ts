import { prisma } from '../../lib/prisma.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import type { RedeemRewardInput } from './loyalty.schema.js';

export async function getClientLoyalty(tenantId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, tenantId },
  });
  if (!client) throw new NotFoundError('Client');

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { rewardThreshold: true },
  });

  const redeemedRewards = await prisma.redeemedReward.findMany({
    where: { clientId },
    include: { service: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return {
    stamps: client.stamps,
    rewardThreshold: tenant?.rewardThreshold ?? 10,
    redeemedRewards,
    canRedeem: client.stamps >= (tenant?.rewardThreshold ?? 10),
  };
}

export async function redeemReward(tenantId: string, input: RedeemRewardInput) {
  const client = await prisma.client.findFirst({
    where: { id: input.clientId, tenantId },
  });
  if (!client) throw new NotFoundError('Client');

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { rewardThreshold: true },
  });

  const threshold = tenant?.rewardThreshold ?? 10;

  if (client.stamps < threshold) {
    throw new BadRequestError(
      `Client needs ${threshold} stamps to redeem a reward, but only has ${client.stamps}.`,
    );
  }

  const service = await prisma.service.findFirst({
    where: { id: input.serviceId, tenantId },
  });
  if (!service) throw new NotFoundError('Service');

  const reward = await prisma.$transaction(async (tx) => {
    await tx.client.update({
      where: { id: input.clientId },
      data: { stamps: { decrement: threshold } },
    });

    return tx.redeemedReward.create({
      data: {
        clientId: input.clientId,
        appointmentId: input.appointmentId ?? null,
        serviceId: input.serviceId,
        serviceName: service.name,
        stampsUsed: threshold,
      },
    });
  });

  return {
    ...reward,
    stampsRemaining: client.stamps - threshold,
  };
}
