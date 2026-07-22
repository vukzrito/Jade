import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { resolveTenant } from './middleware/tenant.js';

import authRoutes from './modules/auth/auth.routes.js';
import tenantRoutes from './modules/tenants/tenant.routes.js';
import userRoutes from './modules/users/user.routes.js';
import clientRoutes from './modules/clients/client.routes.js';
import serviceRoutes from './modules/services/service.routes.js';
import categoryRoutes from './modules/categories/category.routes.js';
import appointmentRoutes from './modules/appointments/appointment.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(resolveTenant);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
