import { Request, Response, NextFunction } from 'express';
import * as clientService from './client.service.js';
import { paginationSchema } from '../../types/index.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const params = paginationSchema.parse(req.query);
    const result = await clientService.listClients(req.tenantId!, params);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await clientService.getClient(req.tenantId!, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await clientService.createClient(req.tenantId!, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await clientService.updateClient(req.tenantId!, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await clientService.deleteClient(req.tenantId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const q = (req.query.q as string) || '';
    const result = await clientService.searchClients(req.tenantId!, q);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
