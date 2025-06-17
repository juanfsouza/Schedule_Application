import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { EventRepository } from '../repositories/event.repository';
import { EventService } from '../services/event.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const eventRepository = new EventRepository(prisma);
const eventService = new EventService(eventRepository, prisma);
const eventController = new EventController(eventService);

const router = Router();

router.post('/', eventController.createEvent);

export default router;