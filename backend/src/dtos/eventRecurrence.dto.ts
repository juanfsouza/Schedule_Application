import { z } from 'zod';

export const createRecurrenceSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.number().min(1).default(1),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(), // 0 = Domingo, 6 = Sábado
  endDate: z.string().datetime().optional(),
  count: z.number().min(1).optional(),
});

export const updateRecurrenceSchema = createRecurrenceSchema.partial(); // Permite campos opcionais para atualização

export type CreateRecurrenceDTO = z.infer<typeof createRecurrenceSchema>;
export type UpdateRecurrenceDTO = z.infer<typeof updateRecurrenceSchema>;