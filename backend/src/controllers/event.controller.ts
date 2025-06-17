import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { validate } from '../middleware/validator.middleware';
import { createEventSchema } from '../dtos/event.dto';
import { authMiddleware } from '../middleware/auth.middleware';

// Extend Express Request interface to include 'user'
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
      return res.status(201).json({
        status: 'success',
        data: event,
      });
    },
  ];
}