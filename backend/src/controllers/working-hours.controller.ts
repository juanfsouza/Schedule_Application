import { Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validator.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { WorkingHoursService } from '../services/working-hours.service';
import { z } from 'zod';

const createWorkingHoursSchema = z.object({
  mondayStart: z.number().min(0).max(1440).optional(),
  mondayEnd: z.number().min(0).max(1440).optional(),
  // Add other days
});

export class WorkingHoursController {
  private workingHoursService: WorkingHoursService;

  constructor(workingHoursService: WorkingHoursService) {
    this.workingHoursService = workingHoursService;
  }

  createWorkingHours = [
    authMiddleware,
    validate(createWorkingHoursSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = req.body;
        const userId = req.user!.id;
        const workingHours = await this.workingHoursService.createWorkingHours(data, userId);
        res.status(201).json({ status: 'success', data: workingHours });
      } catch (error) {
        next(error);
      }
    },
  ];

  getWorkingHours = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!.id;
        const workingHours = await this.workingHoursService.getWorkingHours(userId);
        res.status(200).json({ status: 'success', data: workingHours });
      } catch (error) {
        next(error);
      }
    },
  ];

  updateWorkingHours = [
    authMiddleware,
    validate(createWorkingHoursSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const data = req.body;
        const workingHours = await this.workingHoursService.updateWorkingHours(id, data);
        res.status(200).json({ status: 'success', data: workingHours });
      } catch (error) {
        next(error);
      }
    },
  ];

  deleteWorkingHours = [
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        await this.workingHoursService.deleteWorkingHours(id);
        res.status(204).json();
      } catch (error) {
        next(error);
      }
    },
  ];
}