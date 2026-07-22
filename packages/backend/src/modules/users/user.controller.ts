import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import { paginationSchema } from '../../types/index.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await userService.listUsers(req.tenantId!, params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.createUser(req.tenantId!, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await userService.updateUser(req.tenantId!, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteUser(req.tenantId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
