import { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validator.middleware';
import { createRecurrenceSchema } from '../dtos/eventRecurrence.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { EventRecurrenceService } from '../services/event.recurrence.service';

export class EventRecurrenceController {
  private eventRecurrenceService: EventRecurrenceService;

  constructor(eventRecurrenceService: EventRecurrenceService) {
    this.eventRecurrenceService = eventRecurrenceService;
  }

  createRecurrence = [
    authMiddleware,
    validate(createRecurrenceSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params; // ID do evento
        const data = req.body;
        const recurrence = await this.eventRecurrenceService.createRecurrence(id, data);
        res.status(201).json({ status: 'success', data: recurrence });
      } catch (error) {
        next(error);
      }
    },
  ];

  getRecurrences = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { eventId } = req.query;
        const recurrences = await this.eventRecurrenceService.getRecurrences(eventId as string);
        res.status(200).json({ status: 'success', data: recurrences });
      } catch (error) {
        next(error);
      }
    },
  ];

  updateRecurrence = [
    authMiddleware,
    validate(createRecurrenceSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params; // ID da recorrência
        const data = req.body;
        const recurrence = await this.eventRecurrenceService.updateRecurrence(id, data);
        res.status(200).json({ status: 'success', data: recurrence });
      } catch (error) {
        next(error);
      }
    },
  ];

  deleteRecurrence = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params; // ID da recorrência
        await this.eventRecurrenceService.deleteRecurrence(id);
        res.status(204).json();
      } catch (error) {
        next(error);
      }
    },
  ];
}