import { Request, Response, NextFunction } from 'express';
import * as tenantService from './tenant.service.js';

export async function getCurrentTenant(req: Request, res: Response, next: NextFunction) {
  try {
    const tenant = await tenantService.getTenant(req.tenantId!);
    res.json(tenant);
  } catch (err) {
    next(err);
  }
}

export async function updateCurrentTenant(req: Request, res: Response, next: NextFunction) {
  try {
    const tenant = await tenantService.updateTenant(req.tenantId!, req.body);
    res.json(tenant);
  } catch (err) {
    next(err);
  }
}
