import { NextFunction, Request, Response } from 'express';
import { CalendarService } from '../services/calendar.service';
import { validate } from '../middleware/validator.middleware';
import { createCalendarSchema } from '../dtos/calendar.dto';
import { authMiddleware } from '../middleware/auth.middleware';

export class CalendarController {
    private calendarService: CalendarService;

    constructor(calendarService: CalendarService) {
    this.calendarService = calendarService;
    }

    createCalendar = [
    authMiddleware,
    validate(createCalendarSchema),
    async (req: Request, res: Response) => {
        const data = req.body;
        const userId = req.user!.id;
        const calendar = await this.calendarService.createCalendar(data, userId);
        return res.status(201).json({
        status: 'success',
        data: calendar,
        });
    },
    ];

    getCalendars = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calendars = await this.calendarService.getCalendars(req.user!.id);
      res.status(200).json({ status: 'success', data: calendars });
    } catch (error) {
      next(error);
    }
  };

  getCalendarById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calendar = await this.calendarService.getCalendarById(req.params.id);
      res.status(200).json({ status: 'success', data: calendar });
    } catch (error) {
      next(error);
    }
  };

  updateCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calendar = await this.calendarService.updateCalendar(req.params.id, req.body);
      res.status(200).json({ status: 'success', data: calendar });
    } catch (error) {
      next(error);
    }
  };

  deleteCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.calendarService.deleteCalendar(req.params.id);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  };
}