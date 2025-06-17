import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  timezone: z.string().default('UTC'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;