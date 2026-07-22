import { Request, Response, NextFunction } from 'express';
import * as categoryService from './category.service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await categoryService.listCategories(req.tenantId!);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await categoryService.createCategory(req.tenantId!, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await categoryService.updateCategory(req.tenantId!, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await categoryService.deleteCategory(req.tenantId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
