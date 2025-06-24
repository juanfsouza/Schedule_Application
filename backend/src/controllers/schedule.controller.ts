import { Request, Response } from 'express';
import { validate } from '../middleware/validator.middleware';
import { createScheduleSchema } from '../dtos/schedule.dto';
import { authMiddleware } from '../middleware/auth.middleware';
import { ScheduleService } from '../services/schedule.service';

export class ScheduleController {
  private scheduleService: ScheduleService;

  constructor(scheduleService: ScheduleService) {
    this.scheduleService = scheduleService;
  }

  getSchedules = [
    authMiddleware,
    async (req: Request, res: Response) => {
      const userId = req.user!.id;
      const schedules = await this.scheduleService.getSchedules(userId);
      return res.status(200).json({ status: 'success', data: schedules });
    },
  ];

  createSchedule = [
    authMiddleware,
    validate(createScheduleSchema),
    async (req: Request, res: Response) => {
      const data = req.body;
      const userId = req.user!.id;
      const schedule = await this.scheduleService.createSchedule(data, userId);
      return res.status(201).json({ status: 'success', data: schedule });
    },
  ];
}