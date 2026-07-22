import { Router } from 'express';
import * as appointmentController from './appointment.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createAppointmentSchema, updateAppointmentSchema } from './appointment.schema.js';

const router = Router();

router.get('/date', authenticate, appointmentController.getByDate);
router.get('/', authenticate, appointmentController.list);
router.post('/', authenticate, validate(createAppointmentSchema), appointmentController.create);
router.get('/:id', authenticate, appointmentController.getById);
router.patch('/:id', authenticate, validate(updateAppointmentSchema), appointmentController.update);
router.delete('/:id', authenticate, appointmentController.remove);

export default router;
