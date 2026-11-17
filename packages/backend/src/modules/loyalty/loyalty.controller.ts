import { Request, Response, NextFunction } from 'express';
import * as loyaltyService from './loyalty.service.js';

export async function getClientStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loyaltyService.getClientLoyalty(req.tenantId!, req.params.clientId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function redeem(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loyaltyService.redeemReward(req.tenantId!, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
