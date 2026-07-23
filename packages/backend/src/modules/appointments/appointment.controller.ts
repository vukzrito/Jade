import { Request, Response, NextFunction } from 'express';
import * as appointmentService from './appointment.service.js';
import { appointmentQuerySchema, createPaymentSchema } from './appointment.schema.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = appointmentQuerySchema.parse(req.query);
    const result = await appointmentService.listAppointments(req.tenantId!, query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await appointmentService.getAppointment(req.tenantId!, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await appointmentService.createAppointment(req.tenantId!, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await appointmentService.updateAppointment(req.tenantId!, req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await appointmentService.deleteAppointment(req.tenantId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getByDate(req: Request, res: Response, next: NextFunction) {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const result = await appointmentService.getAppointmentsByDate(req.tenantId!, date);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getClientHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await appointmentService.getClientAppointments(req.tenantId!, req.params.clientId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createPaymentSchema.parse(req.body);
    const result = await appointmentService.createPayment(req.tenantId!, req.params.id, input);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await appointmentService.getPayments(req.tenantId!, req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
