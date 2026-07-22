import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = header.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      role: payload.role as any,
    };
    req.tenantId = payload.tenantId;
    next();
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = header.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email,
      role: payload.role as any,
    };
    req.tenantId = payload.tenantId;
  } catch {
    // silent fail for optional auth
  }

  next();
}
