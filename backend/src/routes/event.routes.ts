import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { EventRepository } from '../repositories/event.repository';
import { EventService } from '../services/event.service';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
const eventRepository = new EventRepository(prisma);
const eventService = new EventService(eventRepository, prisma);
const eventController = new EventController(eventService);

const router = Router();

router.post('/', eventController.createEvent);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, category } = req.query;
    const events = await eventService.getEvents(userId as string, category as string);
    res.status(200).json({ status: 'success', data: events });
  } catch (error) {
    next(error);
  }
});

export default router;