import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { EventRepository } from '../repositories/event.repository';
import { EventService } from '../services/event.service';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

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

// Add GET route for retrieving a single event by ID
router.get('/:id', [
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error('Unauthorized');
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      if (!event) {
        return res.status(404).json({ status: 'error', message: 'Event not found' });
      }
      res.status(200).json({ status: 'success', data: event });
    } catch (error) {
      next(error);
    }
  },
]);

// Add PUT route for updating an event
router.put('/:id', [
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error('Unauthorized');
      const { id } = req.params;
      const data = req.body;
      const updatedEvent = await eventService.updateEvent(id, data);
      res.status(200).json({ status: 'success', data: updatedEvent });
    } catch (error) {
      next(error);
    }
  },
]);

// Add DELETE route for deleting an event
router.delete('/:id', [
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new Error('Unauthorized');
      const { id } = req.params;
      await eventService.deleteEvent(id);
      res.status(200).json({ status: 'success', message: 'Event deleted' });
    } catch (error) {
      next(error);
    }
  },
]);

export default router;