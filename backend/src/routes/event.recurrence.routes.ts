import { Router } from 'express';

import { PrismaClient } from '@prisma/client';
import { EventRecurrenceService } from '../services/event.recurrence.service';
import { EventRecurrenceController } from '../controllers/event.recurrence.controller';

const prisma = new PrismaClient();
const eventRecurrenceService = new EventRecurrenceService(prisma);
const eventRecurrenceController = new EventRecurrenceController(eventRecurrenceService);

const router = Router();

router.post('/events/:id/recurrence', ...eventRecurrenceController.createRecurrence);
router.get('/recurrences', ...eventRecurrenceController.getRecurrences);
router.put('/recurrences/:id', ...eventRecurrenceController.updateRecurrence);
router.delete('/recurrences/:id', ...eventRecurrenceController.deleteRecurrence);

export default router;