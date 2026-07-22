import { prisma } from '../../lib/prisma.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/errors.js';
import type { LoginInput, RegisterInput } from './auth.schema.js';

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

  const token = signToken({
    sub: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError('Email already registered');

  let tenantId: string;

  if (input.tenantSlug) {
    const tenant = await prisma.tenant.findUnique({ where: { slug: input.tenantSlug } });
    if (!tenant) throw new NotFoundError('Tenant');
    tenantId = tenant.id;
  } else if (input.tenantName) {
    const slug = input.tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const tenant = await prisma.tenant.create({
      data: { name: input.tenantName, slug, email: input.email },
    });
    tenantId = tenant.id;
  } else {
    throw new Error('Either tenantSlug or tenantName is required');
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      tenantId,
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: input.tenantSlug ? 'STAFF' : 'OWNER',
    },
  });

  const token = signToken({
    sub: user.id,
    tenantId: user.tenantId,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User');

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    tenantId: user.tenantId,
  };
}
