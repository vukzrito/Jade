import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ error: { message: 'Missing or invalid authorization header' } });
      return;
    }

    const token = header.slice(7);
    const { supabaseUserId, email } = await authService.verifySupabaseToken(token);
    const result = await authService.register(req.body, supabaseUserId, email);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.getProfile(req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
