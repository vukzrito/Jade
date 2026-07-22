import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/pagination.js';
import type { CreateServiceInput, UpdateServiceInput } from './service.schema.js';
import type { PaginationParams } from '../../types/index.js';

export async function listServices(tenantId: string, params: PaginationParams) {
  const where = { tenantId };
  const [data, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: { category: true },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { name: 'asc' },
    }),
    prisma.service.count({ where }),
  ]);

  return paginatedResponse(data, total, params);
}

export async function getAllServices(tenantId: string) {
  return prisma.service.findMany({
    where: { tenantId, isActive: true },
    include: { category: true },
    orderBy: { name: 'asc' },
  });
}

export async function getService(tenantId: string, serviceId: string) {
  const service = await prisma.service.findFirst({
    where: { id: serviceId, tenantId },
    include: { category: true },
  });
  if (!service) throw new NotFoundError('Service');
  return service;
}

export async function createService(tenantId: string, input: CreateServiceInput) {
  return prisma.service.create({
    data: { ...input, tenantId },
    include: { category: true },
  });
}

export async function updateService(tenantId: string, serviceId: string, input: UpdateServiceInput) {
  const service = await prisma.service.findFirst({ where: { id: serviceId, tenantId } });
  if (!service) throw new NotFoundError('Service');

  return prisma.service.update({
    where: { id: serviceId },
    data: input,
    include: { category: true },
  });
}

export async function deleteService(tenantId: string, serviceId: string) {
  const service = await prisma.service.findFirst({ where: { id: serviceId, tenantId } });
  if (!service) throw new NotFoundError('Service');

  await prisma.service.delete({ where: { id: serviceId } });
}
