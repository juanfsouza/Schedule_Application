import { z } from 'zod';

export const createCalendarSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    color: z.string().default('#3b82f6'),
    isDefault: z.boolean().default(false),
    isVisible: z.boolean().default(true),
});

export type CreateCalendarDTO = z.infer<typeof createCalendarSchema>;