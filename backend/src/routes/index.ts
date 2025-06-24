import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import calendarRoutes from './calendar.routes';
import userRoutes from './user.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/events', eventRoutes);
routes.use('/calendars', calendarRoutes);
routes.use('/users', userRoutes);