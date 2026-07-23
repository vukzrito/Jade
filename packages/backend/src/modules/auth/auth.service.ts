import { prisma } from '../../lib/prisma.js';
import { supabaseAdmin } from '../../lib/supabase.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors.js';
import type { RegisterInput } from './auth.schema.js';

export async function register(input: RegisterInput, supabaseUserId: string, email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('Email already registered');

  let tenantId: string;

  if (input.tenantSlug) {
    const tenant = await prisma.tenant.findUnique({ where: { slug: input.tenantSlug } });
    if (!tenant) throw new NotFoundError('Tenant');
    tenantId = tenant.id;
  } else if (input.tenantName) {
    const slug = input.tenantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const tenant = await prisma.tenant.create({
      data: { name: input.tenantName, slug, email },
    });
    tenantId = tenant.id;
  } else {
    throw new Error('Either tenantSlug or tenantName is required');
  }

  const user = await prisma.user.create({
    data: {
      supabaseId: supabaseUserId,
      tenantId,
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: input.tenantSlug ? 'STAFF' : 'OWNER',
    },
  });

  return {
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

export async function verifySupabaseToken(token: string) {
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) throw new UnauthorizedError('Invalid or expired token');
  return { supabaseUserId: user.id, email: user.email! };
}
