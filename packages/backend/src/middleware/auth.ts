import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { prisma } from '../lib/prisma.js';
import { UnauthorizedError } from '../utils/errors.js';

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = header.slice(7);

    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const appUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    if (!appUser) {
      throw new UnauthorizedError('User not found');
    }

    if (!appUser.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    req.user = {
      id: appUser.id,
      tenantId: appUser.tenantId,
      email: appUser.email,
      role: appUser.role,
    };
    req.tenantId = appUser.tenantId;
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = header.slice(7);

    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
      next();
      return;
    }

    const appUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    });

    if (appUser?.isActive) {
      req.user = {
        id: appUser.id,
        tenantId: appUser.tenantId,
        email: appUser.email,
        role: appUser.role,
      };
      req.tenantId = appUser.tenantId;
    }

    next();
  } catch {
    next();
  }
}
