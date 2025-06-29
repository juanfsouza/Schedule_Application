import { z } from 'zod';
import { EventStatus, EventType } from '@prisma/client';

const baseEventSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  allDay: z.boolean().default(false),
  color: z.string().optional(),
  location: z.string().optional(),
  status: z.nativeEnum(EventStatus).default('CONFIRMED'),
  type: z.nativeEnum(EventType).default('APPOINTMENT'),
  isRecurring: z.boolean().default(false),
  calendarId: z.string().uuid(),
});

export const createEventSchema = baseEventSchema.refine(
  (data) => new Date(data.startTime) < new Date(data.endTime),
  {
    message: 'Start time must be before end time',
    path: ['startTime'],
  }
);

export const updateEventSchema = baseEventSchema.partial().refine(
  (data) =>
    !data.startTime ||
    !data.endTime ||
    new Date(data.startTime) < new Date(data.endTime),
  {
    message: 'Start time must be before end time',
    path: ['startTime'],
  }
);

export type CreateEventDTO = z.infer<typeof createEventSchema>;
export type UpdateEventDTO = z.infer<typeof updateEventSchema>;