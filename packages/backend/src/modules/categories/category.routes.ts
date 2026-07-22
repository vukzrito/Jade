import { Router } from 'express';
import * as categoryController from './category.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from './category.schema.js';

const router = Router();

router.get('/', authenticate, categoryController.list);
router.post('/', authenticate, validate(createCategorySchema), categoryController.create);
router.patch('/:id', authenticate, validate(updateCategorySchema), categoryController.update);
router.delete('/:id', authenticate, categoryController.remove);

export default router;
