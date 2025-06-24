import { z } from 'zod';

export const createAttendeeSchema = z.object({
  eventId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(100).optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED', 'TENTATIVE']).default('PENDING'),
  role: z.enum(['ORGANIZER', 'ATTENDEE', 'OPTIONAL']).default('ATTENDEE'),
});

export const updateAttendeeSchema = createAttendeeSchema.partial().omit({ eventId: true }); // eventId não é atualizável

export type CreateAttendeeDTO = z.infer<typeof createAttendeeSchema>;
export type UpdateAttendeeDTO = z.infer<typeof updateAttendeeSchema>;