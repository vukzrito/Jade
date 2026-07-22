import { Request, Response, NextFunction } from 'express';

export function resolveTenant(req: Request, _res: Response, next: NextFunction): void {
  const tenantSlug = req.headers['x-tenant-slug'] as string | undefined;

  if (tenantSlug) {
    req.tenantId = tenantSlug;
  }

  next();
}
