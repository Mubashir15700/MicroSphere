import { z } from 'zod';

export const RegisterFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }).trim(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const ProfileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }).trim(),
});

export const UserSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),

  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .nonempty({ message: 'Name is required.' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .nonempty({ message: 'Password is required.' })
    .optional(),

  role: z.enum(['user', 'admin'], { message: 'Role must be either "user" or "admin".' }),
});

export const TaskSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'Title must be at least 2 characters long.' })
    .nonempty({ message: 'Title is required.' }),

  description: z.string().optional().or(z.literal('')),

  status: z.enum(['pending', 'in progress', 'completed'], {
    message: 'Status must be pending, in progress, or completed.',
  }),

  dueDate: z.string().optional().or(z.literal('')),

  assigneeId: z.string().optional().or(z.literal('')),
});
