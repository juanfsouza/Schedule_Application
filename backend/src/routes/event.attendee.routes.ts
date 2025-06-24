import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventAttendeeController } from '../controllers/event.attendee.controller';
import { EventAttendeeService } from '../services/event.attendee.service';

const prisma = new PrismaClient();
const eventAttendeeService = new EventAttendeeService(prisma);
const eventAttendeeController = new EventAttendeeController(eventAttendeeService);

const router = Router();

router.post('/', ...eventAttendeeController.createAttendee);
router.get('/', ...eventAttendeeController.getAttendees);
router.get('/:id', ...eventAttendeeController.getAttendeeById);
router.put('/:id', ...eventAttendeeController.updateAttendee);
router.delete('/:id', ...eventAttendeeController.deleteAttendee);

export default router;