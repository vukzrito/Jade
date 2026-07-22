import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/pagination.js';
import type { CreateClientInput, UpdateClientInput } from './client.schema.js';
import type { PaginationParams } from '../../types/index.js';

export async function listClients(tenantId: string, params: PaginationParams) {
  const where = { tenantId };
  const [data, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.count({ where }),
  ]);

  return paginatedResponse(data, total, params);
}

export async function getClient(tenantId: string, clientId: string) {
  const client = await prisma.client.findFirst({ where: { id: clientId, tenantId } });
  if (!client) throw new NotFoundError('Client');
  return client;
}

export async function createClient(tenantId: string, input: CreateClientInput) {
  return prisma.client.create({
    data: { ...input, tenantId },
  });
}

export async function updateClient(tenantId: string, clientId: string, input: UpdateClientInput) {
  const client = await prisma.client.findFirst({ where: { id: clientId, tenantId } });
  if (!client) throw new NotFoundError('Client');

  return prisma.client.update({
    where: { id: clientId },
    data: input,
  });
}

export async function deleteClient(tenantId: string, clientId: string) {
  const client = await prisma.client.findFirst({ where: { id: clientId, tenantId } });
  if (!client) throw new NotFoundError('Client');

  await prisma.client.delete({ where: { id: clientId } });
}

export async function searchClients(tenantId: string, query: string) {
  return prisma.client.findMany({
    where: {
      tenantId,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query } },
      ],
    },
    take: 20,
    orderBy: { firstName: 'asc' },
  });
}
