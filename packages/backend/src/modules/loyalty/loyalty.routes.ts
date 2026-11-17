import { Router } from 'express';
import * as loyaltyController from './loyalty.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { redeemRewardSchema } from './loyalty.schema.js';

const router = Router();

router.get('/client/:clientId', authenticate, loyaltyController.getClientStatus);
router.post('/redeem', authenticate, validate(redeemRewardSchema), loyaltyController.redeem);

export default router;
