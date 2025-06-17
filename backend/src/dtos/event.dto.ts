import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  allDay: z.boolean().default(false),
  color: z.string().optional(),
  location: z.string().optional(),
  calendarId: z.string().uuid(),
});

export type CreateEventDTO = z.infer<typeof createEventSchema>;