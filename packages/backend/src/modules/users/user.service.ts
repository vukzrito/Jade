import { prisma } from '../../lib/prisma.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { paginatedResponse } from '../../utils/pagination.js';
import type { CreateUserInput, UpdateUserInput } from './user.schema.js';
import type { PaginationParams } from '../../types/index.js';

export async function listUsers(tenantId: string, params: PaginationParams) {
  const where = { tenantId };
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, phone: true, isActive: true, createdAt: true,
      },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return paginatedResponse(data, total, params);
}

export async function createUser(tenantId: string, input: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError('Email already in use');

  const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });

  if (error || !authUser.user) {
    throw new Error(error?.message || 'Failed to create auth user');
  }

  const user = await prisma.user.create({
    data: {
      supabaseId: authUser.user.id,
      tenantId,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      phone: input.phone,
    },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, phone: true, isActive: true, createdAt: true,
    },
  });

  return user;
}

export async function updateUser(tenantId: string, userId: string, input: UpdateUserInput) {
  const user = await prisma.user.findFirst({ where: { id: userId, tenantId } });
  if (!user) throw new NotFoundError('User');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, phone: true, isActive: true, createdAt: true,
    },
  });

  return updated;
}

export async function deleteUser(tenantId: string, userId: string) {
  const user = await prisma.user.findFirst({ where: { id: userId, tenantId } });
  if (!user) throw new NotFoundError('User');

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });
}
