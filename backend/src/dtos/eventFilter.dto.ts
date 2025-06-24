import { z } from 'zod';

export const eventFilterSchema = z.object({
  userId: z.string().uuid(),
  category: z.enum(['APPOINTMENT', 'MEETING', 'BIRTHDAY', 'REMINDER', 'TASK', 'OTHER']).optional(),
});

export type EventFilterDTO = z.infer<typeof eventFilterSchema>;