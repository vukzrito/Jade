import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.schema.js';

export async function listCategories(tenantId: string) {
  return prisma.category.findMany({
    where: { tenantId },
    include: { services: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function createCategory(tenantId: string, input: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({
    where: { tenantId_name: { tenantId, name: input.name } },
  });
  if (existing) throw new ConflictError('Category with this name already exists');

  return prisma.category.create({
    data: { ...input, tenantId },
  });
}

export async function updateCategory(tenantId: string, categoryId: string, input: UpdateCategoryInput) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, tenantId } });
  if (!category) throw new NotFoundError('Category');

  return prisma.category.update({
    where: { id: categoryId },
    data: input,
  });
}

export async function deleteCategory(tenantId: string, categoryId: string) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, tenantId } });
  if (!category) throw new NotFoundError('Category');

  await prisma.category.delete({ where: { id: categoryId } });
}
