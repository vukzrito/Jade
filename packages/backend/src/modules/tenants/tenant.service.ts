import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../utils/errors.js';
import type { UpdateTenantInput } from './tenant.schema.js';

export async function getTenant(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new NotFoundError('Tenant');
  return tenant;
}

export async function getTenantBySlug(slug: string) {
  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) throw new NotFoundError('Tenant');
  return tenant;
}

export async function updateTenant(tenantId: string, input: UpdateTenantInput) {
  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: input,
  });
  return tenant;
}
