import { Router } from 'express';

import { PrismaClient } from '@prisma/client';
import { ScheduleController } from '../controllers/schedule.controller';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { ScheduleService } from '../services/schedule.service';

const prisma = new PrismaClient();
const scheduleRepository = new ScheduleRepository(prisma);
const scheduleService = new ScheduleService(scheduleRepository);
const scheduleController = new ScheduleController(scheduleService);

const router = Router();

router.get('/', scheduleController.getSchedules);
router.post('/', scheduleController.createSchedule);

export default router;