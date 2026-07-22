import { Request, Response, NextFunction } from 'express';
import * as notificationService from './notification.service.js';

export async function updateToken(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.updateFcmToken(req.user!.id, req.body.token);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function sendToUser(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.sendToUser(req.body.userId, req.body.title, req.body.body, req.body.data);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function sendToTenant(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.sendToTenant(req.tenantId!, req.body.title, req.body.body, req.body.data);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
