import { z } from 'zod';

export const registerUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
  timezone: z.string().default('UTC'),
});

export const updateUserSchema = registerUserSchema.partial().omit({ password: true });

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;