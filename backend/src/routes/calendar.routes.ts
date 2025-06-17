import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';
import { CalendarRepository } from '../repositories/calendar.repository';
import { CalendarService } from '../services/calendar.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const calendarRepository = new CalendarRepository(prisma);
const calendarService = new CalendarService(calendarRepository);
const calendarController = new CalendarController(calendarService);

const router = Router();

router.post('/', calendarController.createCalendar);

export default router;