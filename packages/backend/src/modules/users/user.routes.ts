import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createUserSchema, updateUserSchema } from './user.schema.js';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List staff users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated list of users
 *   post:
 *     tags: [Users]
 *     summary: Create a staff user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User created
 */
router.get('/', authenticate, userController.list);
router.post('/', authenticate, validate(createUserSchema), userController.create);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 *   delete:
 *     tags: [Users]
 *     summary: Deactivate a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deactivated
 */
router.patch('/:id', authenticate, validate(updateUserSchema), userController.update);
router.delete('/:id', authenticate, userController.remove);

export default router;
