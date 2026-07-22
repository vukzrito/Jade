import { Router } from 'express';
import * as notificationController from './notification.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { updateFcmTokenSchema, sendNotificationSchema } from './notification.schema.js';

const router = Router();

router.post('/token', authenticate, validate(updateFcmTokenSchema), notificationController.updateToken);
router.post('/send', authenticate, validate(sendNotificationSchema), notificationController.sendToUser);
router.post('/broadcast', authenticate, notificationController.sendToTenant);

export default router;
