import { Router } from 'express';
import * as tenantController from './tenant.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { updateTenantSchema } from './tenant.schema.js';

const router = Router();

/**
 * @openapi
 * /tenants:
 *   get:
 *     tags: [Tenants]
 *     summary: Get current tenant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenant details
 *   patch:
 *     tags: [Tenants]
 *     summary: Update current tenant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenant updated
 */
router.get('/', authenticate, tenantController.getCurrentTenant);
router.patch('/', authenticate, validate(updateTenantSchema), tenantController.updateCurrentTenant);

export default router;
