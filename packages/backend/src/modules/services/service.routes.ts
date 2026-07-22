import { Router } from 'express';
import * as serviceController from './service.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createServiceSchema, updateServiceSchema } from './service.schema.js';

const router = Router();

router.get('/all', authenticate, serviceController.getAll);
router.get('/', authenticate, serviceController.list);
router.post('/', authenticate, validate(createServiceSchema), serviceController.create);
router.get('/:id', authenticate, serviceController.getById);
router.patch('/:id', authenticate, validate(updateServiceSchema), serviceController.update);
router.delete('/:id', authenticate, serviceController.remove);

export default router;
