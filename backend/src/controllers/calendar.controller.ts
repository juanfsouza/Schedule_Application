import { Request, Response } from 'express';
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
}