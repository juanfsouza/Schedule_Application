import { z } from 'zod';

export const createScheduleSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(['Daily Standup', 'Team Meeting', 'Lunch Break', 'Client Meeting', 'Other']),
  color: z.string().default('#3b82f6'),
});

export type CreateScheduleDTO = z.infer<typeof createScheduleSchema>;