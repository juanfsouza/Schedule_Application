import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { validate } from '../middleware/validator.middleware';
import { createEventSchema } from '../dtos/event.dto';
import { authMiddleware } from '../middleware/auth.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

  createEvent = [
    authMiddleware,
    validate(createEventSchema),
    async (req: Request, res: Response) => {
      const data = req.body;
      const userId = req.user!.id;
      const event = await this.eventService.createEvent(data, userId);
      return res.status(201).json({ status: 'success', data: event });
    },
  ];

  getEvents = [
    authMiddleware,
    async (req: Request, res: Response) => {
      const userId = req.user!.id;
      const { category } = req.query;
      const events = await this.eventService.getEvents(userId, category as string);
      return res.status(200).json({ status: 'success', data: events });
    },
  ];
}