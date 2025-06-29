import { Router } from 'express';
import authRoutes from './auth.routes';
import eventRoutes from './event.routes';
import calendarRoutes from './calendar.routes';
import userRoutes from './user.routes';
import eventAttendeeRoutes from './event.attendee.routes';
import eventRecurrenceRoutes from './event.recurrence.routes';
import scheduleRoutes from './schedule.routes';

export const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/events', eventRoutes);
routes.use('/calendars', calendarRoutes);
routes.use('/users', userRoutes);
routes.use('/recurrences', eventRecurrenceRoutes);
routes.use('/attendees', eventAttendeeRoutes);
routes.use('/schedule', scheduleRoutes);