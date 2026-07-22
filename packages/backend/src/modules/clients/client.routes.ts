import { Router } from 'express';
import * as clientController from './client.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createClientSchema, updateClientSchema } from './client.schema.js';

const router = Router();

/**
 * @openapi
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: List clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paginated list of clients
 *   post:
 *     tags: [Clients]
 *     summary: Create a client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Client created
 * /clients/search:
 *   get:
 *     tags: [Clients]
 *     summary: Search clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Matching clients
 * /clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get client by ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client details
 *   patch:
 *     tags: [Clients]
 *     summary: Update a client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client updated
 *   delete:
 *     tags: [Clients]
 *     summary: Delete a client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Client deleted
 */
router.get('/search', authenticate, clientController.search);
router.get('/', authenticate, clientController.list);
router.post('/', authenticate, validate(createClientSchema), clientController.create);
router.get('/:id', authenticate, clientController.getById);
router.patch('/:id', authenticate, validate(updateClientSchema), clientController.update);
router.delete('/:id', authenticate, clientController.remove);

export default router;
