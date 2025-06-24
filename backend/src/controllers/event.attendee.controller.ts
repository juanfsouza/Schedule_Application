import { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validator.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { createAttendeeSchema, updateAttendeeSchema } from '../dtos/event.attendee.dto';
import { EventAttendeeService } from '../services/event.attendee.service';

export class EventAttendeeController {
  private eventAttendeeService: EventAttendeeService;

  constructor(eventAttendeeService: EventAttendeeService) {
    this.eventAttendeeService = eventAttendeeService;
  }

  createAttendee = [
    authMiddleware,
    validate(createAttendeeSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = req.body;
        const attendee = await this.eventAttendeeService.createAttendee(data);
        res.status(201).json({ status: 'success', data: attendee });
      } catch (error) {
        next(error);
      }
    },
  ];

  getAttendees = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { eventId } = req.query;
        const attendees = await this.eventAttendeeService.getAttendees(eventId as string);
        res.status(200).json({ status: 'success', data: attendees });
      } catch (error) {
        next(error);
      }
    },
  ];

  getAttendeeById = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const attendee = await this.eventAttendeeService.getAttendeeById(id);
        res.status(200).json({ status: 'success', data: attendee });
      } catch (error) {
        next(error);
      }
    },
  ];

  updateAttendee = [
    authMiddleware,
    validate(updateAttendeeSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const data = req.body;
        const attendee = await this.eventAttendeeService.updateAttendee(id, data);
        res.status(200).json({ status: 'success', data: attendee });
      } catch (error) {
        next(error);
      }
    },
  ];

  deleteAttendee = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        await this.eventAttendeeService.deleteAttendee(id);
        res.status(204).json();
      } catch (error) {
        next(error);
      }
    },
  ];
}